const airtableAdapter =
    require("./airtableAdapter");

const {
    canonicalize,
    hashValue
} = require("./productionMutationPlanCanonicalizer");

const REVIEW_TABLE =
    "Accommodatie beoordelingen";

const DEFAULT_REVIEW_STATUS =
    "Nog niet beoordeeld";

const MAPPED_REVIEW_FIELDS =
    new Set([
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

    return (
        typeof value === "string" &&
        value.trim() !== ""
    );

}


function isValidRecordId(value) {

    return (
        isNonEmptyString(value) &&
        /^rec[A-Za-z0-9]+$/.test(value)
    );

}


function isValidHttpUrl(value) {

    if (!isNonEmptyString(value)) {
        return false;
    }

    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
        return false;
    }

}


function isPlainObject(value) {

    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
    }

    const prototype =
        Object.getPrototypeOf(value);

    return (
        prototype === Object.prototype ||
        prototype === null
    );

}


function hasOneLinkedRecord(value, recordId) {

    return (
        Array.isArray(value) &&
        value.length === 1 &&
        value[0] === recordId
    );

}


function validateOptionalField(fieldName, value, errors) {

    if (value === undefined || value === null) {
        errors.push(`${fieldName} mag niet null of undefined zijn; laat het veld weg.`);
        return;
    }

    if (
        typeof value === "string" &&
        value.trim() === ""
    ) {
        errors.push(`${fieldName} mag niet leeg zijn.`);
        return;
    }

    if (fieldName === "Status" || fieldName === "Opmerking") {
        if (typeof value !== "string") {
            errors.push(`${fieldName} moet een niet-lege tekst zijn.`);
        }
        return;
    }

    if (fieldName === "Waarde / Resultaat") {
        if (
            typeof value === "number" &&
            !Number.isFinite(value)
        ) {
            errors.push(`${fieldName} moet een eindig getal zijn.`);
            return;
        }

        if (
            typeof value !== "string" &&
            typeof value !== "number" &&
            typeof value !== "boolean"
        ) {
            errors.push(
                `${fieldName} moet tekst, een eindig getal of een boolean zijn.`
            );
        }
        return;
    }

    if (fieldName === "Keuze") {
        const validChoice =
            (
                Array.isArray(value) &&
                value.length > 0 &&
                value.every(choice =>
                    isValidRecordId(choice) ||
                    (
                        isPlainObject(choice) &&
                        isValidRecordId(choice.id)
                    )
                )
            );

        if (!validChoice) {
            errors.push(
                "Keuze moet een niet-lege lijst met geldige Airtable-record-IDs zijn."
            );
        }
        return;
    }

    if (fieldName === "Foto / Bewijs") {
        const validAttachments =
            Array.isArray(value) &&
            value.length > 0 &&
            value.every(attachment =>
                isPlainObject(attachment) &&
                (
                    isNonEmptyString(attachment.id) ||
                isValidHttpUrl(attachment.url)
                )
            );

        if (!validAttachments) {
            errors.push(
                "Foto / Bewijs moet een niet-lege lijst met attachment-objecten met id of url zijn."
            );
        }
    }

}


function validateMappedReviewInput({
    mapping,
    accommodationId,
    voorzieningId,
    pointId,
    fields
}) {

    const errors = [];
    const hasAccommodationId =
        accommodationId !== undefined &&
        accommodationId !== null;
    const hasVoorzieningId =
        voorzieningId !== undefined &&
        voorzieningId !== null;

    if (!isPlainObject(mapping)) {
        errors.push("mapping moet een object zijn.");
    }

    const point =
        mapping?.point;

    if (!isPlainObject(point)) {
        errors.push("mapping.point moet een object zijn.");
    }

    if (!isValidRecordId(point?.recordId)) {
        errors.push("mapping.point.recordId moet een geldige Airtable-record-ID zijn.");
    }

    if (!isNonEmptyString(point?.name)) {
        errors.push("mapping.point.name moet niet-lege tekst zijn.");
    }

    if (!isValidRecordId(pointId)) {
        errors.push("pointId moet een geldige Airtable-record-ID zijn.");
    } else if (
        isValidRecordId(point?.recordId) &&
        pointId !== point.recordId
    ) {
        errors.push("pointId moet gelijk zijn aan mapping.point.recordId.");
    }

    if (hasAccommodationId === hasVoorzieningId) {
        errors.push(
            "Geef precies één van accommodationId of voorzieningId op."
        );
    }

    const entityId =
        hasAccommodationId ? accommodationId : voorzieningId;
    const entityField =
        hasAccommodationId ? "Accommodatie" : "Voorziening";
    const entityLinkKey =
        hasAccommodationId ? "accommodation" : "voorziening";

    if (!isValidRecordId(entityId)) {
        errors.push(
            `${hasAccommodationId ? "accommodationId" : "voorzieningId"} moet een geldige Airtable-record-ID zijn.`
        );
    }

    if (
        mapping?.review?.table !== REVIEW_TABLE
    ) {
        errors.push(`mapping.review.table moet '${REVIEW_TABLE}' zijn.`);
    }

    if (
        mapping?.review?.links?.[entityLinkKey] !== entityField
    ) {
        errors.push(
            `mapping.review.links.${entityLinkKey} moet '${entityField}' zijn.`
        );
    }

    if (
        mapping?.review?.links?.point !== "Beoordelingspunt"
    ) {
        errors.push(
            "mapping.review.links.point moet 'Beoordelingspunt' zijn."
        );
    }

    if (!isPlainObject(fields)) {
        errors.push("fields moet een niet-leeg object zijn.");
        return errors;
    }

    if (Object.keys(fields).length === 0) {
        errors.push("fields mag niet leeg zijn.");
    }

    for (const fieldName of Object.keys(fields)) {
        if (!MAPPED_REVIEW_FIELDS.has(fieldName)) {
            errors.push(`fields bevat het niet-toegestane veld '${fieldName}'.`);
        }
    }

    const oppositeEntityField =
        hasAccommodationId ? "Voorziening" : "Accommodatie";

    if (Object.prototype.hasOwnProperty.call(fields, oppositeEntityField)) {
        errors.push(`fields mag '${oppositeEntityField}' niet bevatten.`);
    }

    if (!isNonEmptyString(fields["Beoordeling naam"])) {
        errors.push("fields['Beoordeling naam'] moet niet-lege tekst zijn.");
    }

    if (
        !isValidRecordId(entityId) ||
        !hasOneLinkedRecord(fields[entityField], entityId)
    ) {
        errors.push(
            `fields['${entityField}'] moet exact de opgegeven entity-ID bevatten.`
        );
    }

    if (
        !isValidRecordId(point?.recordId) ||
        !hasOneLinkedRecord(
            fields["Beoordelingspunt"],
            point.recordId
        )
    ) {
        errors.push(
            "fields['Beoordelingspunt'] moet exact mapping.point.recordId bevatten."
        );
    }

    for (const fieldName of [
        "Status",
        "Waarde / Resultaat",
        "Keuze",
        "Opmerking",
        "Foto / Bewijs"
    ]) {
        if (Object.prototype.hasOwnProperty.call(fields, fieldName)) {
            validateOptionalField(
                fieldName,
                fields[fieldName],
                errors
            );
        }
    }

    return errors;

}


function containsLinkedRecord(fieldValue, recordId) {

    if (!Array.isArray(fieldValue)) {
        return false;
    }

    return fieldValue.some(value => {

        if (typeof value === "string") {
            return value === recordId;
        }

        if (value && typeof value === "object") {
            return value.id === recordId;
        }

        return false;

    });

}


function findMatchingRecords(records, entityField, entityId, pointId) {

    return records.filter(record => {

        const linkedEntityField =
            record.fields?.[entityField];

        const pointField =
            record.fields?.Beoordelingspunt;

        return (
            containsLinkedRecord(linkedEntityField, entityId) &&
            containsLinkedRecord(pointField, pointId)
        );

    });

}


function buildUpdateFields(existing, incomingFields) {

    const update = {};

    for (const key of Object.keys(incomingFields)) {

        const val = incomingFields[key];

        // Skip undefined or null
        if (val === undefined || val === null) continue;

        // For strings: skip empty string
        if (typeof val === "string" && val.trim() === "") continue;

        // For arrays: skip empty arrays
        if (Array.isArray(val) && val.length === 0) continue;

        // Otherwise include
        update[key] = val;

    }

    return update;

}


async function buildPlanTarget({
    action,
    recordId,
    accommodationId,
    voorzieningId,
    pointId,
    fields
}) {

    const tables =
        await airtableAdapter.getTables();

    if (!/^app[A-Za-z0-9]+$/.test(process.env.AIRTABLE_BASE_ID || "")) {
        throw new Error("Plan-target mist een geldige Airtable-base-ID.");
    }

    const tableForName = name => {
        const matches =
            tables.filter(table => table?.name === name);

        if (
            matches.length !== 1 ||
            !/^tbl[A-Za-z0-9]+$/.test(matches[0]?.id) ||
            !Array.isArray(matches[0]?.fields)
        ) {
            throw new Error(
                `Plan-target kan Airtable-tabel '${name}' niet eenduidig valideren.`
            );
        }

        return matches[0];
    };

    const reviewTable =
        tableForName(REVIEW_TABLE);

    const entityField =
        accommodationId ? "Accommodatie" : "Voorziening";

    const entityTable =
        tableForName(
            accommodationId
                ? "Accommodaties"
                : "Voorzieningen"
        );

    const pointTable =
        tableForName("Beoordelingspunten");

    const fieldIdForName = name => {
        const matches =
            reviewTable.fields.filter(field => field?.name === name);

        if (
            matches.length !== 1 ||
            !/^fld[A-Za-z0-9]+$/.test(matches[0]?.id)
        ) {
            throw new Error(
                `Plan-target mist een stabiele Airtable-veld-ID voor '${name}'.`
            );
        }

        return matches[0].id;
    };

    const fieldIds = {};

    for (const fieldName of Object.keys(fields)) {
        fieldIds[fieldName] =
            fieldIdForName(fieldName);
    }

    return {
        provider: "airtable",
        baseId: process.env.AIRTABLE_BASE_ID,
        tableId: reviewTable.id,
        recordId: action === "UPDATE" ? recordId : null,
        entity: {
            fieldId: fieldIdForName(entityField),
            tableId: entityTable.id,
            recordId: accommodationId || voorzieningId
        },
        point: {
            fieldId: fieldIdForName("Beoordelingspunt"),
            tableId: pointTable.id,
            recordId: pointId
        },
        fieldIds
    };

}


function planReviewUpsertFromRecords({
    records,
    accommodationId,
    voorzieningId,
    pointId,
    fields,
    fieldsOnUpdate = fields,
    expectedAction,
    expectedMatchIds
}) {

    if (!pointId) {
        throw new Error(
            "planReviewUpsertFromRecords: pointId is verplicht."
        );
    }

    if (!accommodationId && !voorzieningId) {
        throw new Error(
            "planReviewUpsertFromRecords: accommodationId of voorzieningId is verplicht."
        );
    }

    if (accommodationId && voorzieningId) {
        throw new Error(
            "planReviewUpsertFromRecords: geef óf accommodationId óf voorzieningId, niet beide."
        );
    }

    if (!Array.isArray(records)) {
        throw new Error(
            "planReviewUpsertFromRecords: records moet een array zijn."
        );
    }

    const entityField =
        accommodationId ? "Accommodatie" : "Voorziening";

    const entityId =
        accommodationId || voorzieningId;

    const matches =
        findMatchingRecords(records, entityField, entityId, pointId);

    const result = {
        matches: matches.length,
        matchIds: matches.map(record => record.id),
        action: null,
        plannedFields: null,
        recordId: null
    };

    const observedAction =
        matches.length === 0
            ? "CREATE"
            : matches.length === 1
                ? "UPDATE"
                : "BLOCKED_MULTIPLE_MATCHES";

    const observedMatchIds =
        result.matchIds.slice().sort();

    const expectedMatchIdsSorted =
        Array.isArray(expectedMatchIds)
            ? expectedMatchIds.slice().sort()
            : null;

    if (
        (
            expectedAction &&
            expectedAction !== observedAction
        ) ||
        (
            expectedMatchIds !== undefined &&
            (
                !expectedMatchIdsSorted ||
                JSON.stringify(expectedMatchIdsSorted) !==
                    JSON.stringify(observedMatchIds)
            )
        )
    ) {
        result.action = "BLOCKED_PLAN_DIVERGENCE";
        result.expectedAction = expectedAction;
        result.observedAction = observedAction;
        result.expectedMatchIds = expectedMatchIdsSorted;
        result.observedMatchIds = result.matchIds;
        return result;
    }

    if (matches.length === 0) {
        result.action = "CREATE";
        result.plannedFields = fields;
        return result;
    }

    if (matches.length > 1) {
        result.action = "BLOCKED_MULTIPLE_MATCHES";
        return result;
    }

    const existing =
        matches[0];

    result.action = "UPDATE";
    result.plannedFields =
        buildUpdateFields(existing, fieldsOnUpdate);
    result.recordId = existing.id;

    return result;

}


async function upsertReview({
    accommodationId,
    voorzieningId,
    pointId,
    fields,
    fieldsOnUpdate = fields,
    expectedAction,
    expectedMatchIds,
    planExecution,
    dryRun = false
}) {

    if (typeof dryRun !== "boolean") {
        throw new Error("upsertReview: dryRun moet true of false zijn.");
    }

    if (!pointId) {
        throw new Error(
            "upsertReview: pointId is verplicht."
        );
    }

    if (!accommodationId && !voorzieningId) {
        throw new Error(
            "upsertReview: accommodationId of voorzieningId is verplicht."
        );
    }

    if (accommodationId && voorzieningId) {
        throw new Error(
            "upsertReview: geef óf accommodationId óf voorzieningId, niet beide."
        );
    }

    if (
        !dryRun &&
        (
            !planExecution ||
            typeof planExecution !== "object" ||
            !planExecution.planService ||
            typeof planExecution.planService.recordOperationStart !== "function" ||
            typeof planExecution.planService.recordOperationResult !== "function" ||
            typeof planExecution.planService.finishPlan !== "function" ||
            !planExecution.permit ||
            typeof planExecution.permit !== "object" ||
            typeof planExecution.operationId !== "string" ||
            !planExecution.operationId
        )
    ) {
        const error =
            new Error("upsertReview: een geldig PlanStore-permit is verplicht voor live writes.");
        error.code = "PLAN_PERMIT_REQUIRED";
        throw error;
    }

    let result;

    try {
        const all =
            await airtableAdapter.listRecords(REVIEW_TABLE);

        result =
            planReviewUpsertFromRecords({
                records: all,
                accommodationId,
                voorzieningId,
                pointId,
                fields,
                fieldsOnUpdate,
                expectedAction,
                expectedMatchIds
            });
    } catch (error) {
        if (!dryRun) {
            try {
                planExecution.planService.finishPlan(
                    planExecution.permit,
                    { kind: "stopped", errorCode: "PREFLIGHT_FAILED" }
                );
            } catch (finishError) {
                throw new AggregateError(
                    [error, finishError],
                    "Review-preflight en PlanStore-afsluiting zijn mislukt."
                );
            }
        }

        throw error;
    }

    if (result.action !== "CREATE" && result.action !== "UPDATE") {
        if (!dryRun) {
            planExecution.planService.finishPlan(
                planExecution.permit,
                { kind: "stopped", errorCode: "NO_ACTIONABLE_OPERATION" }
            );
        }

        return result;

    }

    const writeFields =
        result.action === "CREATE"
            ? fields
            : result.plannedFields;

    if (result.action === "UPDATE" && Object.keys(writeFields).length === 0) {
        if (!dryRun) {
            planExecution.planService.finishPlan(
                planExecution.permit,
                { kind: "stopped", errorCode: "NO_FIELDS_TO_UPDATE" }
            );
        }

        return result;
    }

    if (dryRun) {
        return result;
    }

    let expectedTarget;
    let expectedPayloadHash;
    let expectedTargetJson;
    let writePayload;

    try {
        writePayload =
            JSON.parse(canonicalize(writeFields));

        expectedTarget =
            await buildPlanTarget({
                action: result.action,
                recordId: result.recordId,
                accommodationId,
                voorzieningId,
                pointId,
                fields: writePayload
            });

        expectedPayloadHash =
            hashValue("payload", writePayload);
        expectedTargetJson =
            canonicalize(expectedTarget);
    } catch (error) {
        try {
            planExecution.planService.finishPlan(
                planExecution.permit,
                { kind: "stopped", errorCode: "TARGET_VALIDATION_FAILED" }
            );
        } catch (finishError) {
            throw new AggregateError(
                [error, finishError],
                "Plan-targetvalidatie en PlanStore-afsluiting zijn mislukt."
            );
        }

        throw error;
    }

    let operation;

    try {
        operation =
            planExecution.planService.recordOperationStart(
                planExecution.permit,
                planExecution.operationId
            );
    } catch (error) {
        if (error?.code !== "PLAN_EXPIRED") {
            try {
                planExecution.planService.finishPlan(
                    planExecution.permit,
                    { kind: "stopped", errorCode: "OPERATION_START_FAILED" }
                );
            } catch (finishError) {
                throw new AggregateError(
                    [error, finishError],
                    "Planoperatie kon niet starten en PlanStore-afsluiting is mislukt."
                );
            }
        }

        throw error;
    }

    let operationMatches = false;
    let operationComparisonError = null;

    try {
        operationMatches =
            operation?.operationId === planExecution.operationId &&
            operation?.system === "airtable" &&
            operation.action === result.action.toLowerCase() &&
            operation.payloadHash === expectedPayloadHash &&
            canonicalize(operation.payload) === canonicalize(writePayload) &&
            canonicalize(operation.target) === expectedTargetJson;
    } catch (error) {
        operationComparisonError = error;
    }

    if (!operationMatches) {
        const mismatch =
            new Error("upsertReview: PlanStore-operatie wijkt af van de actuele review-write.");
        mismatch.code = "PLAN_OPERATION_MISMATCH";
        if (operationComparisonError) {
            mismatch.cause = operationComparisonError;
        }

        try {
            planExecution.planService.recordOperationResult(
                planExecution.permit,
                planExecution.operationId,
                { status: "failed", errorCode: "PLAN_OPERATION_MISMATCH" }
            );
            planExecution.planService.finishPlan(
                planExecution.permit,
                { kind: "stopped", errorCode: "PLAN_OPERATION_MISMATCH" }
            );
        } catch (finishError) {
            throw new AggregateError(
                [mismatch, finishError],
                "Planoperatiemismatch en PlanStore-afsluiting zijn mislukt."
            );
        }

        throw mismatch;
    }

    let writeResult;
    const adapterAuthorization = {
        ...planExecution,
        operation
    };

    try {
        if (result.action === "CREATE") {
            writeResult = await airtableAdapter.createRecord(
                REVIEW_TABLE,
                writePayload,
                adapterAuthorization
            );
        } else {
            writeResult = await airtableAdapter.updateRecord(
                REVIEW_TABLE,
                result.recordId,
                writePayload,
                adapterAuthorization
            );
        }
    } catch (error) {
        const providerOutcomeUnknown =
            error?.adapterWriteStarted !== false;
        const errorCode =
            providerOutcomeUnknown
                ? "PROVIDER_OUTCOME_UNKNOWN"
                : "ADAPTER_WRITE_BLOCKED";

        try {
            planExecution.planService.recordOperationResult(
                planExecution.permit,
                planExecution.operationId,
                {
                    status: providerOutcomeUnknown ? "unknown" : "failed",
                    errorCode
                }
            );
            planExecution.planService.finishPlan(
                planExecution.permit,
                { kind: "stopped", errorCode }
            );
        } catch (finishError) {
            throw new AggregateError(
                [error, finishError],
                "Review-write-uitkomst en PlanStore-afsluiting zijn mislukt."
            );
        }

        throw error;
    }

    if (writeResult?.id) {
        result.recordId = writeResult.id;
    }

    const operationResult =
        planExecution.planService.recordOperationResult(
            planExecution.permit,
            planExecution.operationId,
            {
                status: "succeeded",
                ...(result.recordId
                    ? { externalReference: result.recordId }
                    : {})
            }
        );

    if (operationResult.planComplete) {
        planExecution.planService.finishPlan(
            planExecution.permit,
            { kind: "completed" }
        );
    }

    return result;

}


function mappedWriteResult(mappingStatus, action, reason, fieldErrors = []) {

    return {
        matches: null,
        matchIds: [],
        action,
        plannedFields: null,
        recordId: null,
        mappingStatus,
        reason,
        fieldErrors
    };

}


async function upsertMappedReview({
    mapping,
    accommodationId,
    voorzieningId,
    pointId,
    fields,
    expectedAction,
    expectedMatchIds,
    planExecution,
    dryRun
}) {

    const mappingStatus =
        mapping?.status;

    if (mappingStatus === "NO_MATCH") {
        return mappedWriteResult(
            mappingStatus,
            "SKIPPED_NO_MATCH",
            "Mappingstatus is NO_MATCH."
        );
    }

    if (
        mappingStatus !== "EXACT" &&
        mappingStatus !== "POSSIBLE"
    ) {
        return mappedWriteResult(
            mappingStatus,
            "BLOCKED_MAPPING_STATUS",
            "Mappingstatus ontbreekt of wordt niet ondersteund."
        );
    }

    if (typeof dryRun !== "boolean") {
        return mappedWriteResult(
            mappingStatus,
            "BLOCKED_MAPPING_STATUS",
            "dryRun moet expliciet true of false zijn."
        );
    }

    if (mappingStatus === "POSSIBLE" && !dryRun) {
        return mappedWriteResult(
            mappingStatus,
            "BLOCKED_MAPPING_STATUS",
            "POSSIBLE-mappings zijn alleen toegestaan in dry-run."
        );
    }

    const fieldErrors =
        validateMappedReviewInput({
            mapping,
            accommodationId,
            voorzieningId,
            pointId,
            fields
        });

    if (fieldErrors.length > 0) {
        return mappedWriteResult(
            mappingStatus,
            "BLOCKED_INVALID_MAPPED_REVIEW",
            "Mapping-write preflight-validatie is mislukt.",
            fieldErrors
        );
    }

    const fieldsOnUpdate = {
        ...fields
    };

    if (fieldsOnUpdate.Status === DEFAULT_REVIEW_STATUS) {
        delete fieldsOnUpdate.Status;
    }

    const result = await upsertReview({
        accommodationId,
        voorzieningId,
        pointId,
        fields,
        fieldsOnUpdate,
        expectedAction,
        expectedMatchIds,
        planExecution,
        dryRun
    });

    return {
        ...result,
        mappingStatus
    };

}


module.exports = {
    DEFAULT_REVIEW_STATUS,
    upsertReview,
    upsertMappedReview,
    planReviewUpsertFromRecords,
    validateMappedReviewInput
};