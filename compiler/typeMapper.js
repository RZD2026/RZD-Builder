
const TYPE_MAP = {

    TEXT: "singleLineText",

    LONGTEXT: "multilineText",

    NUMBER: "number",

    CHECKBOX: "checkbox",

    DATE: "date",

    EMAIL: "email",

    URL: "url",

    PHONE: "phoneNumber",

    SINGLESELECT: "singleSelect",

    MULTISELECT: "multipleSelect"

};

function mapFieldType(type) {

    if (!type) {
        return type;
    }

    return TYPE_MAP[type] || type;

}

module.exports = mapFieldType;