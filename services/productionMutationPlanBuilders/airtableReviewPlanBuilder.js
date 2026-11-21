const airtableAdapter =
    require("../airtableAdapter");

const contentModuleLoader =
    require("../contentModuleLoader");

const mobileReviewStorage =
    require("../mobileReviewStorage");

const pointMappings =
    require("../../content/mapping/pointMappings");

const airtableMapping =
    require("../../content/mapping/airtableMapping");

const reviewWriteService =
    require("../reviewWriteService");


const TABLE_NAMES = Object.freeze({
    reviews: "Accommodatie beoordelingen",
    points: "Beoordelingspunten",
    modules: "Modules",
    accommodations: "Accommodaties",
    provisions: "Voorzieningen"
});

const CONTENT_MODULE = "toegang";

const ALLOWED_INTENTS = new Set([
    "airtable-review",
    "mobile-review"
]);

const REVIEW_FIELD_NAMES = new Set([
    "Accommodatie",
    "Voorziening",
    "Beoordelingspunt",
    "Beoordeling naam",
    "Status",
    "Waarde / Resultaat",
    "Keuze",
    "Opmerking",
    "Foto / Bewijs"
]);


function isNonEmptyString(value) {

    return typeof value === "string" && value.trim() !== "";

}


function isRecordId(value) {

    return isNonEmptyString(value) && /^rec[A-Za-z0-9]+$/.test(value);

}


function assertExactKeys(value, allowedKeys, description) {

    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value) ||
        Object.getPrototypeOf(value) !== Object.prototype
    ) {
        throw new TypeError(`${description} moet een plain object zijn.`);
    }

    for (const key of Reflect.ownKeys(value)) {

        if (typeof key !== "string" || !allowedKeys.has(key)) {
            throw new TypeError(`${description} bevat een niet-ondersteund veld.`);
        }

        const descriptor =
            Object.getOwnPropertyDescriptor(value, key);

        if (
            !descriptor ||
            !descriptor.enumerable ||
            !Object.prototype.hasOwnProperty.call(descriptor, "value")
        ) {
            throw new TypeError(`${description} mag geen accessors bevatten.`);
        }

    }

}


function copyStringArray(value, description) {

    if (!Array.isArray(value) || value.length === 0) {
        throw new TypeError(`${description} is ongeldig.`);
    }

    for (const key of Reflect.ownKeys(value)) {

        if (typeof key === "symbol") {
            throw new TypeError(`${description} bevat aanvullende properties.`);
        }

        if (key === "length") {
            continue;
        }

        if (!/^(0|[1-9]\d*)$/.test(key) || Number(key) >= value.length) {
            throw new TypeError(`${description} bevat aanvullende properties.`);
        }

        const descriptor =
            Object.getOwnPropertyDescriptor(value, key);

        if (
            !descriptor ||
            !descriptor.enumerable ||
            !Object.prototype.hasOwnProperty.call(descriptor, "value")
        ) {
            throw new TypeError(`${description} mag geen accessors bevatten.`);
        }

    }

    const result = [];

    for (let index = 0; index < value.length; index++) {

        const descriptor =
            Object.getOwnPropertyDescriptor(value, String(index));

        if (!descriptor || typeof descriptor.value !== "string" || !descriptor.value.trim()) {
            throw new TypeError(`${description} bevat een ongeldig item.`);
        }

        result.push(descriptor.value);

    }

    if (new Set(result).size !== result.length) {
        throw new TypeError(`${description} bevat dubbele items.`);
    }

    return result;

}


function normalizeIntent(intent) {

    assertExactKeys(
        intent,
        new Set(["type", "voorzieningId", "pointIds", "localReviewIds"]),
        "Review-intent"
    );

    const type =
        Object.getOwnPropertyDescriptor(intent, "type")?.value;

    if (typeof type !== "string" || !ALLOWED_INTENTS.has(type)) {
        throw new TypeError("Review-intent wordt niet ondersteund.");
    }

    if (type === "airtable-review") {

        assertExactKeys(
            intent,
            new Set(["type", "voorzieningId", "pointIds"]),
            "Airtable-review-intent"
        );

        if (!isRecordId(intent.voorzieningId)) {
            throw new TypeError("Airtable-review-intent mist een geldig voorziening-ID.");
        }

        let pointIds;

        if (intent.pointIds !== undefined) {

            pointIds =
                copyStringArray(intent.pointIds, "Airtable-review-intent pointIds");

        }

        return {
            type,
            voorzieningId: intent.voorzieningId,
            ...(pointIds ? { pointIds } : {})
        };

    }

    assertExactKeys(
        intent,
        new Set(["type", "localReviewIds"]),
        "Mobiele review-intent"
    );

    const localReviewIds =
        copyStringArray(intent.localReviewIds, "Mobiele review-intent localReviewIds");

    return {
        type,
        localReviewIds
    };

}


function requireRecord(record, expectedId, description) {

    if (!record || record.id !== expectedId || !record.fields || typeof record.fields !== "object") {
        throw new Error(`${description} is niet betrouwbaar beschikbaar.`);
    }

    return record;

}


function findTable(tables, name) {

    const matches =
        tables.filter(table => table?.name === name);

    if (matches.length !== 1) {
        throw new Error(`Airtable-tabel '${name}' is niet eenduidig beschikbaar.`);
    }

    const table =
        matches[0];

    if (
        !/^tbl[A-Za-z0-9]+$/.test(table.id) ||
        !Array.isArray(table.fields)
    ) {
        throw new Error(`Airtable-tabel '${name}' mist stabiele schema-ID's.`);
    }

    return table;

}


function getFieldIds(table, payload) {

    const fieldIds = {};

    for (const fieldName of Object.keys(payload)) {

        if (!REVIEW_FIELD_NAMES.has(fieldName)) {
            throw new Error("Review-payload bevat een niet-ondersteund veld.");
        }

        const fields =
            table.fields.filter(field => field?.name === fieldName);

        if (
            fields.length !== 1 ||
            !/^fld[A-Za-z0-9]+$/.test(fields[0].id)
        ) {
            throw new Error(
                `Stabiele Airtable-veld-ID ontbreekt voor '${fieldName}'.`
            );
        }

        fieldIds[fieldName] =
            fields[0].id;

    }

    return fieldIds;

}


function validateReviewFields(fields, description) {

    if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
        throw new TypeError(`${description} is ongeldig.`);
    }

    const actualKeys =
        Object.keys(fields);

    if (
        actualKeys.some(key => !REVIEW_FIELD_NAMES.has(key)) ||
        actualKeys.length === 0
    ) {
        throw new TypeError(`${description} bevat niet-ondersteunde velden.`);
    }

}


function buildOperation({
    result,
    baseId,
    reviewTable,
    entityField,
    entityTable,
    entityRecordId,
    pointTable,
    pointRecordId
}) {

    if (result.action !== "CREATE" && result.action !== "UPDATE") {
        return null;
    }

    if (result.action === "UPDATE" && !isRecordId(result.recordId)) {
        throw new Error("Bestaand review-target heeft geen stabiel record-ID.");
    }

    const payload =
        result.plannedFields;

    validateReviewFields(payload, "Review-payload");

    const target = {
        provider: "airtable",
        baseId,
        tableId: reviewTable.id,
        recordId: result.action === "UPDATE" ? result.recordId : null,
        entity: {
            fieldId: getFieldIds(reviewTable, { [entityField]: null })[entityField],
            tableId: entityTable.id,
            recordId: entityRecordId
        },
        point: {
            fieldId: getFieldIds(reviewTable, { "Beoordelingspunt": null })["Beoordelingspunt"],
            tableId: pointTable.id,
            recordId: pointRecordId
        },
        fieldIds: getFieldIds(reviewTable, payload)
    };

    return {
        system: "airtable",
        action: result.action.toLowerCase(),
        target,
        payload
    };

}


function assertUniqueMutationTarget(operations, operation) {

    const target =
        operation.target;

    const identity =
        target.recordId
            ? `${target.tableId}:record:${target.recordId}`
            : `${target.tableId}:entity:${target.entity.tableId}:${target.entity.recordId}:point:${target.point.tableId}:${target.point.recordId}`;

    if (operations.some(existing => {

        const existingTarget =
            existing.target;

        const existingIdentity =
            existingTarget.recordId
                ? `${existingTarget.tableId}:record:${existingTarget.recordId}`
                : `${existingTarget.tableId}:entity:${existingTarget.entity.tableId}:${existingTarget.entity.recordId}:point:${existingTarget.point.tableId}:${existingTarget.point.recordId}`;

        return existingIdentity === identity;

    })) {
        throw new Error("Plan bevat meerdere operaties voor hetzelfde review-target.");
    }

}


function createDefaultSources() {

    return {
        getBaseId: () => process.env.AIRTABLE_BASE_ID,
        getTables: () => airtableAdapter.getTables(),
        listRecords: (tableName, params) =>
            airtableAdapter.listRecords(tableName, params),
        getRecord: (tableName, recordId) =>
            airtableAdapter.getRecord(tableName, recordId),
        loadContentModule: moduleName =>
            contentModuleLoader.load(moduleName),
        getPointMappings: () => pointMappings,
        createMapping: (contentPoint, pointMapping, lookup) =>
            airtableMapping.create(contentPoint, pointMapping, lookup),
        getMobileReview: localReviewId =>
            mobileReviewStorage.getReview(localReviewId)
    };

}


function createAirtableReviewPlanBuilder({
    sources = createDefaultSources()
} = {}) {

    const requiredReadMethods = [
        "getBaseId",
        "getTables",
        "listRecords",
        "getRecord",
        "loadContentModule",
        "getPointMappings",
        "createMapping",
        "getMobileReview"
    ];

    const missingReadMethods =
        requiredReadMethods.filter(method =>
            typeof sources?.[method] !== "function"
        );

    if (missingReadMethods.length > 0) {
        throw new TypeError(
            `Review-planbuilder mist read-port-methoden: ${missingReadMethods.join(", ")}.`
        );
    }

    async function loadAirtableContext() {

        const baseId =
            await sources.getBaseId();

        if (!/^app[A-Za-z0-9]+$/.test(baseId)) {
            throw new Error("Airtable-base-scope ontbreekt.");
        }

        const [tables, reviewRecords, modules, points] =
            await Promise.all([
                sources.getTables(),
                sources.listRecords(TABLE_NAMES.reviews),
                sources.listRecords(TABLE_NAMES.modules),
                sources.listRecords(TABLE_NAMES.points)
            ]);

        if (
            !Array.isArray(tables) ||
            !Array.isArray(reviewRecords) ||
            !Array.isArray(modules) ||
            !Array.isArray(points)
        ) {
            throw new Error("Airtable-bron gaf een ongeldige read-only respons.");
        }

        const tableByName = {
            reviews: findTable(tables, TABLE_NAMES.reviews),
            points: findTable(tables, TABLE_NAMES.points),
            modules: findTable(tables, TABLE_NAMES.modules),
            accommodations: findTable(tables, TABLE_NAMES.accommodations),
            provisions: findTable(tables, TABLE_NAMES.provisions)
        };

        return {
            baseId,
            tableByName,
            reviewRecords,
            lookup: { modules, points }
        };

    }

    async function buildAirtableIntent(intent) {

        const context =
            await loadAirtableContext();

        const provisionRecord =
            requireRecord(
                await sources.getRecord(
                    TABLE_NAMES.provisions,
                    intent.voorzieningId
                ),
                intent.voorzieningId,
                "Voorziening"
            );

        const contentModule =
            await sources.loadContentModule(CONTENT_MODULE);

        if (!Array.isArray(contentModule?.points)) {
            throw new Error("Contentmodule 'toegang' bevat geen geldige puntenlijst.");
        }

        const pointMappings =
            await sources.getPointMappings();

        if (!pointMappings || typeof pointMappings !== "object") {
            throw new Error("Vertrouwde puntmapping ontbreekt.");
        }

        const selectedPoints =
            intent.pointIds
                ? intent.pointIds.map(pointId => {
                    const point =
                        contentModule.points.find(candidate => candidate?.id === pointId);
                    if (!point) {
                        throw new Error("Intent verwijst naar een onbekend contentpunt.");
                    }
                    return point;
                })
                : contentModule.points;

        const operations = [];
        const blocked = [];
        const mappingCounts = {
            exact: 0,
            noMatch: 0,
            possible: 0,
            invalid: 0
        };

        for (const contentPoint of selectedPoints) {

            if (!contentPoint || !isNonEmptyString(contentPoint.id)) {
                throw new Error("Contentmodule bevat een ongeldig punt.");
            }

            const pointMapping =
                pointMappings[contentPoint.id];

            if (!pointMapping) {
                mappingCounts.noMatch++;
                blocked.push({
                    sourceId: contentPoint.id,
                    reason: "MAPPING_MISSING"
                });
                continue;
            }

            const mapping =
                await sources.createMapping(
                    contentPoint,
                    pointMapping,
                    context.lookup
                );

            if (mapping?.status === "POSSIBLE") {
                mappingCounts.possible++;
                blocked.push({
                    sourceId: contentPoint.id,
                    reason: "MAPPING_NOT_EXACT"
                });
                continue;
            }

            if (mapping?.status !== "EXACT") {
                mappingCounts.noMatch++;
                blocked.push({
                    sourceId: contentPoint.id,
                    reason: "MAPPING_NO_MATCH"
                });
                continue;
            }

            mappingCounts.exact++;

            if (
                mapping?.point?.table !== TABLE_NAMES.points ||
                !isRecordId(mapping?.point?.recordId)
            ) {
                mappingCounts.invalid++;
                blocked.push({
                    sourceId: contentPoint.id,
                    reason: "STABLE_POINT_ID_MISSING"
                });
                continue;
            }

            const pointRecord =
                requireRecord(
                    context.lookup.points.find(record =>
                        record.id === mapping.point.recordId
                    ),
                    mapping.point.recordId,
                    "Beoordelingspunt"
                );

            const mappedModule =
                context.lookup.modules.find(record =>
                    record?.fields?.["Module naam"] === pointMapping.airtable?.module
                );

            if (
                !mappedModule ||
                pointRecord.fields["Beoordelingspunt"] !== mapping.point.name ||
                !Array.isArray(pointRecord.fields.Module) ||
                !pointRecord.fields.Module.includes(mappedModule.id)
            ) {
                mappingCounts.invalid++;
                blocked.push({
                    sourceId: contentPoint.id,
                    reason: "MAPPING_SOURCE_DIVERGED"
                });
                continue;
            }

            const fields = {
                "Beoordeling naam": contentPoint.name,
                "Voorziening": [provisionRecord.id],
                "Beoordelingspunt": [pointRecord.id],
                "Status": "Nog niet beoordeeld"
            };

            const validation =
                reviewWriteService.validateMappedReviewInput({
                    mapping,
                    voorzieningId: provisionRecord.id,
                    pointId: pointRecord.id,
                    fields
                });

            if (validation.length > 0) {
                mappingCounts.invalid++;
                blocked.push({
                    sourceId: contentPoint.id,
                    reason: "INVALID_MAPPED_REVIEW"
                });
                continue;
            }

            const fieldsOnUpdate = {
                ...fields
            };

            if (
                fieldsOnUpdate.Status ===
                reviewWriteService.DEFAULT_REVIEW_STATUS
            ) {
                delete fieldsOnUpdate.Status;
            }

            const result =
                reviewWriteService.planReviewUpsertFromRecords({
                    records: context.reviewRecords,
                    voorzieningId: provisionRecord.id,
                    pointId: pointRecord.id,
                    fields,
                    fieldsOnUpdate
                });

            if (result.action === "BLOCKED_MULTIPLE_MATCHES") {
                blocked.push({
                    sourceId: contentPoint.id,
                    reason: "MULTIPLE_REVIEW_TARGETS"
                });
                continue;
            }

            if (result.action === "BLOCKED_PLAN_DIVERGENCE") {
                blocked.push({
                    sourceId: contentPoint.id,
                    reason: "REVIEW_TARGET_DIVERGED"
                });
                continue;
            }

            if (
                result.action === "UPDATE" &&
                Object.keys(result.plannedFields || {}).length === 0
            ) {
                blocked.push({
                    sourceId: contentPoint.id,
                    reason: "NO_FIELDS_TO_UPDATE"
                });
                continue;
            }

            const operation =
                buildOperation({
                    result,
                    baseId: context.baseId,
                    reviewTable: context.tableByName.reviews,
                    entityField: "Voorziening",
                    entityTable: context.tableByName.provisions,
                    entityRecordId: provisionRecord.id,
                    pointTable: context.tableByName.points,
                    pointRecordId: pointRecord.id
                });

            if (!operation) {
                blocked.push({
                    sourceId: contentPoint.id,
                    reason: "UNSUPPORTED_REVIEW_ACTION"
                });
                continue;
            }

            assertUniqueMutationTarget(operations, operation);
            operations.push(operation);

        }

        return {
            intent,
            operations,
            blocked,
            summary: {
                provider: "airtable",
                baseId: context.baseId,
                entityType: "voorziening",
                entityRecordId: provisionRecord.id,
                selected: selectedPoints.length,
                exactMappings: mappingCounts.exact,
                noMatchMappings: mappingCounts.noMatch,
                possibleMappings: mappingCounts.possible,
                invalidMappings: mappingCounts.invalid,
                create: operations.filter(operation => operation.action === "create").length,
                update: operations.filter(operation => operation.action === "update").length,
                blocked: blocked.length
            }
        };

    }

    function validateMobileFields(review) {

        if (!isRecordId(review.accommodationId) || !isRecordId(review.pointId)) {
            throw new Error("Mobiele review mist stabiele accommodatie- of punt-ID.");
        }

        if (review.syncStatus !== "pending") {
            throw new Error(
                "Mobiele review is niet pending; automatische retry/replay is geblokkeerd."
            );
        }

        const fields = {
            "Accommodatie": [review.accommodationId],
            "Beoordelingspunt": [review.pointId]
        };

        if (!["Ja/Nee", "Tekst", "Meting", "number"].includes(review.typeBeoordeling)) {
            throw new Error("Mobiele review heeft een onbekend type beoordeling.");
        }

        const valueForWrite =
            review.typeBeoordeling === "Meting" ||
            review.typeBeoordeling === "number"
                ? String(review.value)
                : review.value;

        if (
            review.typeBeoordeling === "Meting" ||
            review.typeBeoordeling === "number"
        ) {
            const numericValue =
                typeof review.value === "number"
                    ? review.value
                    : Number(review.value);

            if (
                review.value === undefined ||
                review.value === null ||
                (typeof review.value === "string" && !review.value.trim()) ||
                !Number.isFinite(numericValue)
            ) {
                throw new Error("Mobiele meetwaarde is ongeldig.");
            }
        } else if (
            review.typeBeoordeling === "Ja/Nee" &&
            review.value !== "Ja" &&
            review.value !== "Nee"
        ) {
            throw new Error("Mobiele Ja/Nee-review heeft een ongeldige waarde.");
        } else if (
            review.typeBeoordeling === "Tekst" &&
            review.value !== undefined &&
            review.value !== null &&
            typeof review.value !== "string"
        ) {
            throw new Error("Mobiele tekstreview bevat geen tekstwaarde.");
        }

        const optionalFields = [
            ["Status", review.status],
            ["Waarde / Resultaat", valueForWrite],
            ["Keuze", review.choice],
            ["Opmerking", review.note],
            ["Foto / Bewijs", review.photos]
        ];

        for (const [fieldName, fieldValue] of optionalFields) {

            const present =
                fieldValue !== undefined &&
                fieldValue !== null &&
                !(typeof fieldValue === "string" && fieldValue.trim() === "") &&
                !(Array.isArray(fieldValue) && fieldValue.length === 0);

            if (present) {

                if (
                    ["Status", "Keuze", "Opmerking"].includes(fieldName) &&
                    typeof fieldValue !== "string"
                ) {
                    throw new Error(`Mobiele reviewveld '${fieldName}' moet tekst zijn.`);
                }

                if (
                    fieldName === "Foto / Bewijs" &&
                    !Array.isArray(fieldValue)
                ) {
                    throw new Error("Mobiele reviewfoto's moeten een array zijn.");
                }

                fields[fieldName] = fieldValue;
            }

        }

        validateReviewFields(fields, "Mobiele review-payload");

        return fields;

    }

    async function buildMobileIntent(intent) {

        const context =
            await loadAirtableContext();

        const operations = [];
        const blocked = [];
        const seenSources = new Set();

        for (const localReviewId of intent.localReviewIds) {

            const review =
                await sources.getMobileReview(localReviewId);

            if (!review || review.localId !== localReviewId) {
                blocked.push({
                    sourceId: localReviewId,
                    reason: "MOBILE_REVIEW_NOT_FOUND"
                });
                continue;
            }

            if (seenSources.has(review.localId)) {
                throw new Error("Mobiele reviewselectie bevat een dubbel record.");
            }
            seenSources.add(review.localId);

            const fields =
                validateMobileFields(review);

            const [accommodationRecord, pointRecord] =
                await Promise.all([
                    sources.getRecord(
                        TABLE_NAMES.accommodations,
                        review.accommodationId
                    ),
                    sources.getRecord(
                        TABLE_NAMES.points,
                        review.pointId
                    )
                ]);

            requireRecord(
                accommodationRecord,
                review.accommodationId,
                "Accommodatie"
            );
            requireRecord(
                pointRecord,
                review.pointId,
                "Beoordelingspunt"
            );

            const result =
                reviewWriteService.planReviewUpsertFromRecords({
                    records: context.reviewRecords,
                    accommodationId: accommodationRecord.id,
                    pointId: pointRecord.id,
                    fields
                });

            if (
                result.action === "BLOCKED_MULTIPLE_MATCHES" ||
                result.action === "BLOCKED_PLAN_DIVERGENCE"
            ) {
                blocked.push({
                    sourceId: localReviewId,
                    reason: "REVIEW_TARGET_AMBIGUOUS"
                });
                continue;
            }

            if (
                result.action === "UPDATE" &&
                Object.keys(result.plannedFields || {}).length === 0
            ) {
                blocked.push({
                    sourceId: localReviewId,
                    reason: "NO_FIELDS_TO_UPDATE"
                });
                continue;
            }

            const operation =
                buildOperation({
                    result,
                    baseId: context.baseId,
                    reviewTable: context.tableByName.reviews,
                    entityField: "Accommodatie",
                    entityTable: context.tableByName.accommodations,
                    entityRecordId: accommodationRecord.id,
                    pointTable: context.tableByName.points,
                    pointRecordId: pointRecord.id
                });

            if (!operation) {
                blocked.push({
                    sourceId: localReviewId,
                    reason: "UNSUPPORTED_REVIEW_ACTION"
                });
                continue;
            }

            assertUniqueMutationTarget(operations, operation);
            operations.push(operation);

        }

        return {
            intent,
            operations,
            blocked,
            summary: {
                provider: "airtable",
                baseId: context.baseId,
                source: "mobile-review",
                selected: intent.localReviewIds.length,
                create: operations.filter(operation => operation.action === "create").length,
                update: operations.filter(operation => operation.action === "update").length,
                blocked: blocked.length
            }
        };

    }

    return {
        supports: intent =>
            Boolean(intent && ALLOWED_INTENTS.has(intent.type)),
        normalizeIntent,
        async build(intent) {

            const normalizedIntent =
                normalizeIntent(intent);

            if (normalizedIntent.type === "airtable-review") {
                return buildAirtableIntent(normalizedIntent);
            }

            return buildMobileIntent(normalizedIntent);

        }
    };

}


module.exports = {
    ALLOWED_INTENTS,
    CONTENT_MODULE,
    TABLE_NAMES,
    createAirtableReviewPlanBuilder,
    createDefaultSources,
    normalizeIntent
};
