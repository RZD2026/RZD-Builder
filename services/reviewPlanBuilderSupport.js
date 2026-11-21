const REVIEW_TABLE =
    "Accommodatie beoordelingen";

const DEFAULT_REVIEW_STATUS =
    "Nog niet beoordeeld";

const MAPPED_REVIEW_FIELDS = new Set([
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


function isPlainObject(value) {

    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
    }

    const prototype =
        Object.getPrototypeOf(value);

    return prototype === Object.prototype || prototype === null;

}


function isNonEmptyString(value) {

    return typeof value === "string" && value.trim() !== "";

}


function isValidRecordId(value) {

    return isNonEmptyString(value) && /^rec[A-Za-z0-9]+$/.test(value);

}


function hasOneLinkedRecord(value, recordId) {

    return Array.isArray(value) &&
        value.length === 1 &&
        value[0] === recordId;

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


function validateOptionalField(fieldName, value, errors) {

    if (value === undefined || value === null) {
        errors.push(`${fieldName} mag niet null of undefined zijn; laat het veld weg.`);
        return;
    }

    if (typeof value === "string" && value.trim() === "") {
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
        if (typeof value === "number" && !Number.isFinite(value)) {
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
            Array.isArray(value) &&
            value.length > 0 &&
            value.every(choice =>
                isValidRecordId(choice) ||
                (
                    isPlainObject(choice) &&
                    isValidRecordId(choice.id)
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
} = {}) {

    const errors = [];
    const hasAccommodationId =
        accommodationId !== undefined && accommodationId !== null;
    const hasVoorzieningId =
        voorzieningId !== undefined && voorzieningId !== null;

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

    if (mapping?.review?.table !== REVIEW_TABLE) {
        errors.push(`mapping.review.table moet '${REVIEW_TABLE}' zijn.`);
    }

    if (mapping?.review?.links?.[entityLinkKey] !== entityField) {
        errors.push(
            `mapping.review.links.${entityLinkKey} moet '${entityField}' zijn.`
        );
    }

    if (mapping?.review?.links?.point !== "Beoordelingspunt") {
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
        !hasOneLinkedRecord(fields["Beoordelingspunt"], point.recordId)
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
            validateOptionalField(fieldName, fields[fieldName], errors);
        }
    }

    return errors;

}


function containsLinkedRecord(fieldValue, recordId) {

    if (!Array.isArray(fieldValue)) {
        return false;
    }

    return fieldValue.some(value =>
        typeof value === "string"
            ? value === recordId
            : Boolean(value && typeof value === "object" && value.id === recordId)
    );

}


function findMatchingRecords(records, entityField, entityId, pointId) {

    return records.filter(record =>
        containsLinkedRecord(record.fields?.[entityField], entityId) &&
        containsLinkedRecord(record.fields?.Beoordelingspunt, pointId)
    );

}


function buildUpdateFields(fields) {

    const update = {};

    for (const key of Object.keys(fields || {})) {

        const value = fields[key];

        if (
            value === undefined ||
            value === null ||
            (typeof value === "string" && value.trim() === "") ||
            (Array.isArray(value) && value.length === 0)
        ) {
            continue;
        }

        update[key] = value;

    }

    return update;

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
} = {}) {

    if (!pointId) {
        throw new Error("planReviewUpsertFromRecords: pointId is verplicht.");
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
        (expectedAction && expectedAction !== observedAction) ||
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

    result.action = "UPDATE";
    result.plannedFields =
        buildUpdateFields(fieldsOnUpdate);
    result.recordId = matches[0].id;

    return result;

}


module.exports = {
    DEFAULT_REVIEW_STATUS,
    planReviewUpsertFromRecords,
    validateMappedReviewInput
};
