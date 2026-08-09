const CANON_TO_AIRTABLE = {
    text: "singleLineText",
    longText: "multilineText",
    number: "number",
    checkbox: "checkbox",
    singleSelect: "singleSelect",
    url: "url",
    phone: "phoneNumber",
    email: "email",
    date: "date",
    attachment: "multipleAttachments",
    link: "multipleRecordLinks"
};

const AIRTABLE_TO_CANON = Object.fromEntries(
    Object.entries(CANON_TO_AIRTABLE)
        .map(([canon, airtable]) => [airtable, canon])
);

class AirtableTypeMapper {

    toAirtable(type) {

        const mapped =
            CANON_TO_AIRTABLE[type];

        if (!mapped) {
            throw new Error(
                `Geen Airtable type mapping voor Canon type: ${type}`
            );
        }

        return mapped;
    }

    toCanon(type) {

        const mapped =
            AIRTABLE_TO_CANON[type];

        if (!mapped) {
            throw new Error(
                `Geen Canon type mapping voor Airtable type: ${type}`
            );
        }

        return mapped;
    }

    isSupportedCanonType(type) {

        return Object.prototype.hasOwnProperty.call(
            CANON_TO_AIRTABLE,
            type
        );

    }

    isSupportedAirtableType(type) {

        return Object.prototype.hasOwnProperty.call(
            AIRTABLE_TO_CANON,
            type
        );

    }

}

module.exports = new AirtableTypeMapper();