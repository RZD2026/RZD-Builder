const { getParsedType } = require("zod/v3");

const FIELD_TYPES = new Set([
    "text",
    "textarea",
    "number",
    "decimal",
    "currency",
    "percentage",
    "boolean",
    "date",
    "datetime",
    "email",
    "url",
    "phone",
    "select",
    "multiselect",
    "lookup",
    "formula",
    "attachment"
]);

function isEmpty(value) {

    return value === undefined
        || value === null
        || String(value).trim() === "";

}

function isDuplicate(set, value) {

    if (set.has(value)) {
        return true;
    }

    set.add(value);
    return false;

}

function isValidId(value) {

    return /^[a-z][a-z0-9_]*$/i.test(value);

}

function isKnownFieldType(type) {

    return FIELD_TYPES.has(type);

}

module.exports = {

    isEmpty,
    isDuplicate,
    isValidId,
    isKnownFieldType

};getParsedType