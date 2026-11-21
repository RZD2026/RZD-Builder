const crypto =
    require("crypto");

const { assertPlanStore } =
    require("./planStoreContract");

const {
    CANONICALIZATION_VERSION,
    buildCanonicalPlan,
    canonicalize,
    isPlainObject
} = require("./productionMutationPlanCanonicalizer");

const {
    createSqlitePlanStore,
    isTemporaryTestPlanStore
} = require("./sqlitePlanStore");


const PLAN_TTL_MS =
    15 * 60 * 1000;

const MEDIA_SCHEMA_INTENT_TYPE =
    "airtable-media-schema";

const PLAN_TOKEN_PATTERN =
    /^[A-Za-z0-9_-]{43}$/;

const OUTCOME_KINDS =
    new Set(["completed", "stopped"]);

const SERVICE_PRIVATE_STATE =
    new WeakMap();


class ProductionMutationPlanServiceError extends Error {

    constructor(code, message, cause) {

        if (cause) {
            super(message, { cause });
        } else {
            super(message);
        }

        this.name = "ProductionMutationPlanServiceError";
        this.code = code;

    }

}


function sha256(value) {

    return crypto
        .createHash("sha256")
        .update(value, "utf8")
        .digest("hex");

}


function hashPlanToken(planId) {

    if (typeof planId !== "string" || !PLAN_TOKEN_PATTERN.test(planId)) {
        throw new ProductionMutationPlanServiceError(
            "INVALID_PLAN_ID",
            "Plan-ID is ongeldig."
        );
    }

    return sha256(planId);

}


function assertActiveOperation(planService, permit, operationId, operation) {

    const privateState =
        SERVICE_PRIVATE_STATE.get(planService);

    if (!privateState) {
        throw new ProductionMutationPlanServiceError(
            "INVALID_PLAN_SERVICE",
            "PlanService is niet afkomstig van de productieplan-service."
        );
    }

    const state =
        privateState.getPermitState(permit);

    if (
        state.halted ||
        state.inFlight !== operation ||
        state.inFlight?.operationId !== operationId
    ) {
        throw new ProductionMutationPlanServiceError(
            "OPERATION_NOT_ACTIVE",
            "Planoperatie is niet actief voor deze permit."
        );
    }

    privateState.assertPlanStillExecuting(state);

    return state.inFlight;

}


function deepFreeze(value) {

    if (!value || typeof value !== "object" || Object.isFrozen(value)) {
        return value;
    }

    for (const key of Reflect.ownKeys(value)) {
        deepFreeze(value[key]);
    }

    return Object.freeze(value);

}


function cloneJson(value) {

    return JSON.parse(canonicalize(value));

}


function operationDescriptor(operation) {

    return {
        operationId: operation.operationId,
        sequence: operation.sequence,
        system: operation.system,
        action: operation.action,
        target: operation.target,
        payloadHash: operation.payloadHash
    };

}


function assertTrustedContext(trustedContext) {

    const requiredMethods = [
        "resolveActor",
        "authorize",
        "verifyConfirmation"
    ];

    const missingMethods =
        requiredMethods.filter(method =>
            typeof trustedContext?.[method] !== "function"
        );

    if (missingMethods.length > 0) {
        throw new ProductionMutationPlanServiceError(
            "TRUSTED_ACTOR_CONTEXT_REQUIRED",
            `Betrouwbare actor-/bevestigingscontext ontbreekt: ${missingMethods.join(", ")}.`
        );
    }

}


function readIntentType(intent) {

    if (!isPlainObject(intent)) {
        throw new TypeError("Intent moet een plain object zijn.");
    }

    const descriptor =
        Object.getOwnPropertyDescriptor(intent, "type");

    if (
        !descriptor ||
        !descriptor.enumerable ||
        !Object.prototype.hasOwnProperty.call(descriptor, "value")
    ) {
        throw new TypeError("Intent moet een expliciet type bevatten.");
    }

    return descriptor.value;

}


function assertSchemaIntentTypePreserved(originalType, candidateType) {

    if (
        (
            originalType === MEDIA_SCHEMA_INTENT_TYPE &&
            candidateType !== MEDIA_SCHEMA_INTENT_TYPE
        ) ||
        (
            originalType !== MEDIA_SCHEMA_INTENT_TYPE &&
            candidateType === MEDIA_SCHEMA_INTENT_TYPE
        )
    ) {
        throw new ProductionMutationPlanServiceError(
            "SCHEMA_INTENT_TYPE_CHANGED",
            "Een schema-intent mag niet naar of van een ander intenttype worden omgezet."
        );
    }

}


function supportsMediaSchemaIntent(builder) {

    try {

        const normalizedIntent =
            builder.normalizeIntent({
                type: MEDIA_SCHEMA_INTENT_TYPE
            });

        return isPlainObject(normalizedIntent) &&
            normalizedIntent.type === MEDIA_SCHEMA_INTENT_TYPE;

    } catch (error) {

        if (error instanceof TypeError) {
            return false;
        }

        throw error;

    }

}


function isPreviewOnlyBuild(built, intent) {

    return built.previewOnly === true ||
        intent?.type === MEDIA_SCHEMA_INTENT_TYPE;

}


function assertActionableOperations(operations, intent) {

    if (!Array.isArray(operations)) {
        throw new ProductionMutationPlanServiceError(
            "INVALID_PLAN",
            "Planbuilder gaf geen geldige operatieverzameling."
        );
    }

    const isMediaSchemaIntent =
        intent?.type === MEDIA_SCHEMA_INTENT_TYPE;

    for (const operation of operations) {

        if (
            isMediaSchemaIntent &&
            isPlainObject(operation) &&
            operation.system === "airtable-schema" &&
            operation.action === "schema-change"
        ) {
            continue;
        }

        if (
            !isPlainObject(operation) ||
            operation.system !== "airtable" ||
            !["create", "update"].includes(operation.action)
        ) {
            throw new ProductionMutationPlanServiceError(
                "UNSUPPORTED_OPERATION",
                "Plan bevat een niet-ondersteund provider- of actietype."
            );
        }

    }

    if (
        isMediaSchemaIntent &&
        operations.some(operation =>
            operation.system !== "airtable-schema" ||
            operation.action !== "schema-change"
        )
    ) {
        throw new ProductionMutationPlanServiceError(
            "UNSUPPORTED_OPERATION",
            "Media-schema-intenties mogen uitsluitend schema-change-operaties bevatten."
        );
    }

}


function validateOutcome(outcome) {

    if (!isPlainObject(outcome)) {
        throw new ProductionMutationPlanServiceError(
            "INVALID_OUTCOME",
            "Planuitkomst moet een object zijn."
        );
    }

    const allowedKeys =
        new Set(["kind", "errorCode"]);

    for (const key of Reflect.ownKeys(outcome)) {

        const descriptor =
            typeof key === "string"
                ? Object.getOwnPropertyDescriptor(outcome, key)
                : null;

        if (
            typeof key !== "string" ||
            !allowedKeys.has(key) ||
            !descriptor ||
            !descriptor.enumerable ||
            !Object.prototype.hasOwnProperty.call(descriptor, "value")
        ) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_OUTCOME",
                "Planuitkomst bevat niet-ondersteunde velden."
            );
        }

    }

    if (!OUTCOME_KINDS.has(outcome.kind)) {
        throw new ProductionMutationPlanServiceError(
            "INVALID_OUTCOME",
            "Planuitkomst wordt niet ondersteund."
        );
    }

    if (
        outcome.errorCode !== undefined &&
        (
            typeof outcome.errorCode !== "string" ||
            !/^[A-Z0-9_]{1,100}$/.test(outcome.errorCode)
        )
    ) {
        throw new ProductionMutationPlanServiceError(
            "INVALID_OUTCOME",
            "Planuitkomst bevat een ongeldige foutcode."
        );
    }

}


function createProductionMutationPlanService({
    planStore,
    createPlanStore = createSqlitePlanStore,
    planStoreOptions,
    planBuilder,
    planBuilderOptions,
    trustedContext,
    clock = () => new Date()
} = {}) {

    assertTrustedContext(trustedContext);

    const builder =
        planBuilder ||
        require("./productionMutationPlanBuilders/airtableReviewPlanBuilder")
            .createAirtableReviewPlanBuilder(planBuilderOptions);

    if (
        typeof builder?.normalizeIntent !== "function" ||
        typeof builder?.build !== "function"
    ) {
        throw new TypeError(
            "ProductionMutationPlanService vereist een valide planbuilder."
        );
    }

    if (
        supportsMediaSchemaIntent(builder) &&
        !isTemporaryTestPlanStore(planStore)
    ) {
        throw new ProductionMutationPlanServiceError(
            "PREVIEW_TEST_STORE_REQUIRED",
            "Media-schema-intenties vereisen een actieve, tijdelijke SQLite-teststore."
        );
    }

    const usesInjectedBuilder =
        Boolean(planBuilder);

    let store =
        planStore
            ? assertPlanStore(planStore)
            : null;

    if (typeof clock !== "function") {
        throw new TypeError("ProductionMutationPlanService clock moet een functie zijn.");
    }

    const serviceId =
        crypto.randomUUID();

    const permitStates =
        new WeakMap();

    let closed = false;

    function ensureOpen() {

        if (closed) {
            throw new ProductionMutationPlanServiceError(
                "SERVICE_CLOSED",
                "ProductionMutationPlanService is gesloten."
            );
        }

    }

    function ensureStore({ allowInjectedBuilderDefault = false } = {}) {

        if (!store) {

            if (usesInjectedBuilder && !allowInjectedBuilderDefault) {
                throw new ProductionMutationPlanServiceError(
                    "PLAN_STORE_REQUIRED",
                    "Een geïnjecteerde planbuilder vereist een expliciet geïnjecteerde PlanStore voor het lezen van plannen."
                );
            }

            store =
                assertPlanStore(
                    createPlanStore(planStoreOptions)
                );

        }

        return store;

    }


    function currentTime() {

        const value =
            clock();

        if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_CLOCK",
                "De serviceklok gaf geen geldige datum."
            );
        }

        return value;

    }

    async function resolveAuthorizedActor(action, requestContext, resource) {

        const actor =
            await trustedContext.resolveActor(requestContext);

        if (
            !isPlainObject(actor) ||
            typeof actor.id !== "string" ||
            !actor.id.trim()
        ) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_ACTOR",
                "Een geldige, vertrouwde actor ontbreekt."
            );
        }

        const allowed =
            await trustedContext.authorize(
                actor,
                action,
                resource,
                requestContext
            );

        if (allowed !== true) {
            throw new ProductionMutationPlanServiceError(
                "NOT_AUTHORIZED",
                "Actor is niet bevoegd voor deze planactie."
            );
        }

        return actor;

    }

    async function buildPlan(intent) {

        const originalType =
            readIntentType(intent);

        let normalizedIntent;

        try {
            normalizedIntent =
                builder.normalizeIntent(intent);
        } catch (error) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_INTENT",
                "Review-intent is ongeldig of wordt niet ondersteund.",
                error
            );
        }

        const normalizedType =
            readIntentType(normalizedIntent);

        assertSchemaIntentTypePreserved(
            originalType,
            normalizedType
        );

        const built =
            await builder.build(normalizedIntent);

        if (!isPlainObject(built)) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_PLAN",
                "Planbuilder gaf geen geldig plan terug."
            );
        }

        const builtIntentType =
            readIntentType(built.intent);

        assertSchemaIntentTypePreserved(
            normalizedType,
            builtIntentType
        );

        const normalizedBuiltIntent =
            builder.normalizeIntent(built.intent);

        const normalizedBuiltType =
            readIntentType(normalizedBuiltIntent);

        assertSchemaIntentTypePreserved(
            normalizedType,
            normalizedBuiltType
        );

        if (
            canonicalize(normalizedBuiltIntent) !==
            canonicalize(normalizedIntent)
        ) {
            throw new ProductionMutationPlanServiceError(
                "INTENT_MISMATCH",
                "Planbuilder wijzigde de gevalideerde intent."
            );
        }

        assertActionableOperations(
            built.operations,
            normalizedBuiltIntent
        );

        const canonical =
            buildCanonicalPlan({
                intent: normalizedBuiltIntent,
                operations: built.operations,
                blocked: built.blocked || [],
                summary: built.summary || {}
            });

        return {
            built,
            canonical,
            intent: normalizedBuiltIntent
        };

    }

    function makePreview({
        planId,
        createdAt,
        expiresAt,
        built,
        canonical,
        status,
        planStoreStatus = status
    }) {

        return deepFreeze({
            planId,
            status,
            planStoreStatus,
            previewOnly: isPreviewOnlyBuild(built, built.intent),
            canonicalizationVersion: canonical.canonicalizationVersion,
            createdAt,
            expiresAt,
            fingerprint: canonical.fingerprint,
            summary: cloneJson(built.summary || {}),
            blocked: cloneJson(built.blocked || []),
            operations: canonical.operations.map(operation => ({
                operationId: operation.operationId,
                sequence: operation.sequence,
                system: operation.system,
                action: operation.action,
                target: cloneJson(operation.target),
                payloadHash: operation.payloadHash,
                payload: cloneJson(operation.payload)
            }))
        });

    }

    function loadStoredPlan(planId) {

        const planIdHash =
            hashPlanToken(planId);

        const plan =
            store.getPlan(planIdHash);

        if (!plan) {
            throw new ProductionMutationPlanServiceError(
                "PLAN_NOT_FOUND",
                "Plan-ID is niet gevonden."
            );
        }

        return {
            planIdHash,
            plan
        };

    }

    function assertStoredOperationsMatch(plan, canonical) {

        const storedDescriptors =
            plan.operations.map(operationDescriptor);

        const currentDescriptors =
            canonical.document.operations;

        if (
            canonicalize(storedDescriptors) !==
            canonicalize(currentDescriptors)
        ) {
            throw new ProductionMutationPlanServiceError(
                "PLAN_DIVERGED",
                "Planoperaties zijn gewijzigd sinds de preview."
            );
        }

        if (plan.fingerprint !== canonical.fingerprint) {
            throw new ProductionMutationPlanServiceError(
                "PLAN_DIVERGED",
                "Planfingerprint is gewijzigd sinds de preview."
            );
        }

    }

    async function rebuildStoredPlan(
        planId,
        actor,
        requestContext,
        { allowExpired = false } = {}
    ) {

        const { planIdHash, plan } =
            loadStoredPlan(planId);

        if (plan.status !== "ready") {
            throw new ProductionMutationPlanServiceError(
                "PLAN_NOT_READY",
                "Plan is niet meer beschikbaar voor preview of bevestiging."
            );
        }

        const now =
            currentTime();

        if (!allowExpired && Date.parse(plan.expiresAt) <= now.getTime()) {
            throw new ProductionMutationPlanServiceError(
                "PLAN_EXPIRED",
                "Plan-ID is verlopen."
            );
        }

        if (
            plan.metadata?.canonicalizationVersion !==
            CANONICALIZATION_VERSION ||
            !plan.metadata?.sourceDescriptor
        ) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_STORED_PLAN",
                "Planmetadata ontbreekt of gebruikt een niet-ondersteunde versie."
            );
        }

        const previewAllowed =
            await trustedContext.authorize(
            actor,
            "preview",
            {
                planId,
                plan
            },
            requestContext
        );

        if (previewAllowed !== true) {
            throw new ProductionMutationPlanServiceError(
                "NOT_AUTHORIZED",
                "Actor is niet bevoegd om deze preview te lezen."
            );
        }

        const rebuilt =
            await buildPlan(plan.metadata.sourceDescriptor);

        if (
            rebuilt.canonical.canonicalizationVersion !==
            plan.metadata.canonicalizationVersion
        ) {
            throw new ProductionMutationPlanServiceError(
                "CANONICALIZATION_VERSION_MISMATCH",
                "Plan gebruikt een andere canonicalisatieversie."
            );
        }

        assertStoredOperationsMatch(plan, rebuilt.canonical);

        return {
            planIdHash,
            plan,
            rebuilt,
            now
        };

    }

    async function createPlan(intent, requestContext) {

        ensureOpen();

        let originalIntentType;

        try {
            originalIntentType =
                readIntentType(intent);
        } catch (error) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_INTENT",
                "Review-intent is ongeldig of wordt niet ondersteund.",
                error
            );
        }

        if (
            originalIntentType === MEDIA_SCHEMA_INTENT_TYPE &&
            !isTemporaryTestPlanStore(store)
        ) {
            throw new ProductionMutationPlanServiceError(
                "PREVIEW_TEST_STORE_REQUIRED",
                "Media-schema-intenties vereisen een actieve, tijdelijke SQLite-teststore."
            );
        }

        let normalizedIntent;

        try {
            normalizedIntent =
                builder.normalizeIntent(intent);
        } catch (error) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_INTENT",
                "Review-intent is ongeldig of wordt niet ondersteund.",
                error
            );
        }

        const normalizedIntentType =
            readIntentType(normalizedIntent);

        assertSchemaIntentTypePreserved(
            originalIntentType,
            normalizedIntentType
        );

        const actor =
            await resolveAuthorizedActor(
                "create",
                requestContext,
                { intent: normalizedIntent }
            );

        const { built, canonical, intent: sourceDescriptor } =
            await buildPlan(normalizedIntent);

        ensureStore({
            allowInjectedBuilderDefault: true
        });

        if (canonical.operations.length === 0) {
            return deepFreeze({
                planId: null,
                status: "not-actionable",
                previewOnly: isPreviewOnlyBuild(built, sourceDescriptor),
                canonicalizationVersion: canonical.canonicalizationVersion,
                createdAt: null,
                expiresAt: null,
                fingerprint: canonical.fingerprint,
                summary: cloneJson(built.summary || {}),
                blocked: cloneJson(built.blocked || []),
                operations: []
            });
        }

        const now =
            currentTime();

        const expiresAt =
            new Date(now.getTime() + PLAN_TTL_MS);

        const planId =
            crypto.randomBytes(32).toString("base64url");

        const planIdHash =
            sha256(planId);

        store.createPlan({
            planIdHash,
            fingerprint: canonical.fingerprint,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            metadata: {
                canonicalizationVersion: canonical.canonicalizationVersion,
                sourceDescriptor: cloneJson(sourceDescriptor),
                summary: cloneJson(built.summary || {}),
                createdBy: actor.id
            },
            operations: canonical.operations.map(operation => ({
                operationId: operation.operationId,
                system: operation.system,
                action: operation.action,
                target: cloneJson(operation.target),
                payloadHash: operation.payloadHash
            }))
        });

        return makePreview({
            planId,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            built,
            canonical,
            status: isPreviewOnlyBuild(built, sourceDescriptor)
                ? "preview-only"
                : "ready",
            planStoreStatus: "ready"
        });

    }

    async function getPlanPreview(planId, requestContext) {

        ensureOpen();
        ensureStore();

        const actor =
            await resolveAuthorizedActor(
                "preview",
                requestContext,
                { planId }
            );

        const { plan, rebuilt } =
            await rebuildStoredPlan(planId, actor, requestContext);

        return makePreview({
            planId,
            createdAt: plan.createdAt,
            expiresAt: plan.expiresAt,
            built: rebuilt.built,
            canonical: rebuilt.canonical,
            status: isPreviewOnlyBuild(
                rebuilt.built,
                rebuilt.intent
            )
                ? "preview-only"
                : plan.status,
            planStoreStatus: plan.status
        });

    }

    async function confirmAndAuthorize(
        planId,
        explicitConfirmation,
        requestContext
    ) {

        ensureOpen();
        ensureStore();

        if (!isPlainObject(explicitConfirmation)) {
            throw new ProductionMutationPlanServiceError(
                "EXPLICIT_CONFIRMATION_REQUIRED",
                "Expliciete, vertrouwde planbevestiging ontbreekt."
            );
        }

        canonicalize(explicitConfirmation);

        const actor =
            await resolveAuthorizedActor(
                "confirm",
                requestContext,
                { planId }
            );

        const rebuilt =
            await rebuildStoredPlan(
                planId,
                actor,
                requestContext,
                { allowExpired: true }
            );

        if (rebuilt.rebuilt.intent.type === MEDIA_SCHEMA_INTENT_TYPE) {
            throw new ProductionMutationPlanServiceError(
                "SCHEMA_EXECUTION_UNAVAILABLE",
                "Media-schema-plannen zijn preview-only en hebben geen uitvoeringspermit."
            );
        }

        const verified =
            await trustedContext.verifyConfirmation({
                actor,
                planId,
                fingerprint: rebuilt.rebuilt.canonical.fingerprint,
                explicitConfirmation,
                requestContext
            });

        if (verified !== true) {
            throw new ProductionMutationPlanServiceError(
                "EXPLICIT_CONFIRMATION_REQUIRED",
                "De vertrouwde context heeft de expliciete bevestiging niet geverifieerd."
            );
        }

        const now =
            currentTime();

        if (Date.parse(rebuilt.plan.expiresAt) <= now.getTime()) {

            try {

                store.claimPlan({
                    planIdHash: rebuilt.planIdHash,
                    fingerprint: rebuilt.rebuilt.canonical.fingerprint,
                    now: now.toISOString(),
                    confirmedBy: actor.id,
                    claimedBy: serviceId
                });

            } catch (error) {

                if (error?.code === "PLAN_EXPIRED") {
                    throw new ProductionMutationPlanServiceError(
                        "PLAN_EXPIRED",
                        "Plan-ID is verlopen."
                    );
                }

                throw error;

            }

            store.finishPlan({
                planIdHash: rebuilt.planIdHash,
                status: "interrupted",
                finishedAt: now.toISOString(),
                errorCode: "EXPIRED_CLAIM_INVARIANT"
            });

            throw new ProductionMutationPlanServiceError(
                "PLAN_EXPIRED",
                "Plan-ID is verlopen."
            );

        }

        const claimedPlan =
            store.claimPlan({
                planIdHash: rebuilt.planIdHash,
                fingerprint: rebuilt.rebuilt.canonical.fingerprint,
                now: now.toISOString(),
                confirmedBy: actor.id,
                claimedBy: serviceId
            });

        if (
            claimedPlan.status !== "executing" ||
            claimedPlan.fingerprint !== rebuilt.rebuilt.canonical.fingerprint
        ) {
            throw new ProductionMutationPlanServiceError(
                "CLAIM_FAILED",
                "PlanStore bevestigde de atomische claim niet."
            );
        }

        const capability =
            Object.create(null);

        Object.defineProperty(capability, "toJSON", {
            value() {
                throw new ProductionMutationPlanServiceError(
                    "PERMIT_NOT_SERIALIZABLE",
                    "Execution permits kunnen niet worden geserialiseerd."
                );
            },
            enumerable: false
        });

        Object.freeze(capability);

        permitStates.set(capability, {
            serviceId,
            planId,
            planIdHash: rebuilt.planIdHash,
            fingerprint: rebuilt.rebuilt.canonical.fingerprint,
            expiresAt: Date.parse(claimedPlan.expiresAt),
            operations: rebuilt.rebuilt.canonical.operations.map(operation =>
                deepFreeze({
                    operationId: operation.operationId,
                    sequence: operation.sequence,
                    system: operation.system,
                    action: operation.action,
                    target: cloneJson(operation.target),
                    payloadHash: operation.payloadHash,
                    payload: cloneJson(operation.payload)
                })
            ),
            nextSequence: 0,
            inFlight: null,
            halted: false,
            finalized: false
        });

        return capability;

    }

    function getPermitState(permit) {

        if (
            !permit ||
            typeof permit !== "object" ||
            !permitStates.has(permit)
        ) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_PERMIT",
                "Execution permit is ongeldig, gekopieerd of niet van deze service-instance."
            );
        }

        const state =
            permitStates.get(permit);

        if (
            state.serviceId !== serviceId ||
            state.finalized
        ) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_PERMIT",
                "Execution permit is ongeldig of al gebruikt."
            );
        }

        ensureOpen();

        return state;

    }

    function assertPlanStillExecuting(state) {

        const plan =
            store.getPlan(state.planIdHash);

        if (
            !plan ||
            plan.status !== "executing" ||
            plan.fingerprint !== state.fingerprint
        ) {
            throw new ProductionMutationPlanServiceError(
                "PLAN_NOT_EXECUTING",
                "Plan is niet langer geclaimd door deze service."
            );
        }

        return plan;

    }

    function stopExpiredPermit(state, now) {

        if (now.getTime() < state.expiresAt) {
            return false;
        }

        if (state.inFlight) {
            return false;
        }

        store.finishPlan({
            planIdHash: state.planIdHash,
            status: "interrupted",
            finishedAt: now.toISOString(),
            errorCode: "PLAN_EXPIRED"
        });

        state.halted = true;
        state.finalized = true;

        return true;

    }

    function recordOperationStart(permit, operationId) {

        ensureOpen();

        const state =
            getPermitState(permit);

        if (
            state.halted ||
            state.inFlight ||
            typeof operationId !== "string"
        ) {
            throw new ProductionMutationPlanServiceError(
                "OPERATION_NOT_STARTABLE",
                "Planoperatie kan niet worden gestart."
            );
        }

        const now =
            currentTime();

        if (stopExpiredPermit(state, now)) {
            throw new ProductionMutationPlanServiceError(
                "PLAN_EXPIRED",
                "Plan-ID is verlopen voordat de volgende operatie startte."
            );
        }

        assertPlanStillExecuting(state);

        const operation =
            state.operations[state.nextSequence];

        if (!operation || operation.operationId !== operationId) {
            throw new ProductionMutationPlanServiceError(
                "OPERATION_ORDER_INVALID",
                "Planoperaties moeten exact in de geautoriseerde volgorde starten."
            );
        }

        store.startOperation({
            planIdHash: state.planIdHash,
            sequence: operation.sequence,
            operationId: operation.operationId,
            startedAt: now.toISOString()
        });

        state.inFlight = operation;

        return operation;

    }

    function recordOperationResult(permit, operationId, outcome) {

        ensureOpen();

        const state =
            getPermitState(permit);

        if (
            state.halted ||
            !state.inFlight ||
            state.inFlight.operationId !== operationId
        ) {
            throw new ProductionMutationPlanServiceError(
                "OPERATION_NOT_FINISHABLE",
                "Er is geen bijbehorende actieve planoperatie."
            );
        }

        if (!isPlainObject(outcome)) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_OPERATION_OUTCOME",
                "Operatie-uitkomst moet een object zijn."
            );
        }

        const allowedKeys =
            new Set(["status", "externalReference", "errorCode"]);

        for (const key of Reflect.ownKeys(outcome)) {

            const descriptor =
                typeof key === "string"
                    ? Object.getOwnPropertyDescriptor(outcome, key)
                    : null;

            if (
                typeof key !== "string" ||
                !allowedKeys.has(key) ||
                !descriptor ||
                !descriptor.enumerable ||
                !Object.prototype.hasOwnProperty.call(descriptor, "value")
            ) {
                throw new ProductionMutationPlanServiceError(
                    "INVALID_OPERATION_OUTCOME",
                    "Operatie-uitkomst bevat niet-ondersteunde velden."
                );
            }

        }

        const status =
            outcome.status;

        if (!["succeeded", "failed", "unknown"].includes(status)) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_OPERATION_OUTCOME",
                "Operatie-uitkomst wordt niet ondersteund."
            );
        }

        if (
            outcome.externalReference !== undefined &&
            (
                typeof outcome.externalReference !== "string" ||
                !outcome.externalReference.trim() ||
                outcome.externalReference.length > 500
            )
        ) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_OPERATION_OUTCOME",
                "Operatie-uitkomst bevat een ongeldige externe referentie."
            );
        }

        if (
            outcome.errorCode !== undefined &&
            (
                typeof outcome.errorCode !== "string" ||
                !/^[A-Z0-9_]{1,100}$/.test(outcome.errorCode)
            )
        ) {
            throw new ProductionMutationPlanServiceError(
                "INVALID_OPERATION_OUTCOME",
                "Operatie-uitkomst bevat een ongeldige foutcode."
            );
        }

        const now =
            currentTime();

        store.finishOperation({
            planIdHash: state.planIdHash,
            sequence: state.inFlight.sequence,
            operationId,
            status,
            finishedAt: now.toISOString(),
            externalReference: outcome.externalReference ?? null,
            errorCode: outcome.errorCode ?? null
        });

        state.inFlight = null;
        state.nextSequence++;

        if (status !== "succeeded" || now.getTime() >= state.expiresAt) {
            state.halted = true;
        }

        return deepFreeze({
            operationId,
            status,
            nextSequence: state.nextSequence,
            planComplete: state.nextSequence === state.operations.length,
            halted: state.halted
        });

    }

    function finishPlan(permit, outcome) {

        ensureOpen();

        const state =
            getPermitState(permit);

        validateOutcome(outcome);

        if (state.inFlight) {
            throw new ProductionMutationPlanServiceError(
                "OPERATION_IN_PROGRESS",
                "Een actieve operatie moet eerst een resultaat krijgen."
            );
        }

        const plan =
            assertPlanStillExecuting(state);

        let status;

        if (outcome.kind === "completed") {

            if (
                state.halted ||
                state.nextSequence !== state.operations.length
            ) {
                throw new ProductionMutationPlanServiceError(
                    "INVALID_PLAN_OUTCOME",
                    "Een plan kan alleen na succesvolle afronding als completed worden gemarkeerd."
                );
            }

            status = "completed";

        } else {

            const operationStatuses =
                plan.operations.map(operation => operation.status);

            if (operationStatuses.includes("unknown")) {
                status = operationStatuses.includes("succeeded")
                    ? "partial"
                    : "interrupted";
            } else if (operationStatuses.includes("failed")) {
                status = operationStatuses.includes("succeeded")
                    ? "partial"
                    : "failed";
            } else {
                status = "interrupted";
            }

        }

        const now =
            currentTime();

        const finishedPlan =
            store.finishPlan({
                planIdHash: state.planIdHash,
                status,
                finishedAt: now.toISOString(),
                errorCode: outcome.errorCode ?? null
            });

        state.finalized = true;

        return deepFreeze({
            planId: state.planId,
            status: finishedPlan.status,
            finishedAt: finishedPlan.finishedAt,
            errorCode: finishedPlan.errorCode
        });

    }

    function close() {

        if (!closed) {
            if (store) {
                store.close();
            }
            closed = true;
        }

    }

    const service =
        Object.freeze({
        createPlan,
        getPlanPreview,
        confirmAndAuthorize,
        recordOperationStart,
        recordOperationResult,
        finishPlan,
        close
    });

    SERVICE_PRIVATE_STATE.set(service, {
        getPermitState,
        assertPlanStillExecuting
    });

    return service;

}


module.exports = {
    PLAN_TTL_MS,
    ProductionMutationPlanServiceError,
    assertActiveOperation,
    createProductionMutationPlanService,
    hashPlanToken
};
