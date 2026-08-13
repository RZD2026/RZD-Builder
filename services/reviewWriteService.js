const airtableAdapter =
    require("./airtableAdapter");

const REVIEW_TABLE =
    "Accommodatie beoordelingen";


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


function findMatchingRecords(records, accommodationId, pointId) {

    return records.filter(record => {

        const accommodationField =
            record.fields?.Accommodatie;

        const pointField =
            record.fields?.Beoordelingspunt;

        return (
            containsLinkedRecord(accommodationField, accommodationId) &&
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


async function upsertReview({
    accommodationId,
    pointId,
    fields,
    dryRun = false
}) {

    if (!accommodationId || !pointId) {
        throw new Error(
            "upsertReview: accommodationId en pointId zijn verplicht."
        );
    }

    // Fetch existing records (paginated)
    const all = await airtableAdapter.listRecords(REVIEW_TABLE);

    const matches = findMatchingRecords(all, accommodationId, pointId);

    const result = {
        matches: matches.length,
        matchIds: matches.map(r => r.id),
        action: null,
        plannedFields: null,
        recordId: null
    };

    if (matches.length === 0) {

        result.action = "CREATE";
        result.plannedFields = fields;

        if (!dryRun) {
            const created = await airtableAdapter.createRecord(REVIEW_TABLE, fields);
            result.recordId = created.id;
        }

        return result;

    }

    if (matches.length > 1) {

        result.action = "BLOCKED_MULTIPLE_MATCHES";

        return result;

    }

    // Single match -> UPDATE
    const existing = matches[0];

    const updateFields = buildUpdateFields(existing, fields);

    // Ensure we don't intentionally clear value/photo/comment when not provided
    result.action = "UPDATE";
    result.plannedFields = updateFields;
    result.recordId = existing.id;

    if (!dryRun && Object.keys(updateFields).length > 0) {
        const updated = await airtableAdapter.updateRecord(REVIEW_TABLE, existing.id, updateFields);
        result.recordId = updated.id;
    }

    return result;

}


module.exports = {
    upsertReview
};
