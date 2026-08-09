const TYPE_TO_VALUE_FIELD = {
    checkbox: "Waarde ja/nee",
    number: "Waarde getal",
    text: "Waarde tekst",
    longtext: "Waarde tekst",
    select: "Waarde tekst",
    attachment: "Waarde bijlage"
};

class AirtableMapping {

    static create(contentPoint) {

        if (!contentPoint || typeof contentPoint !== "object") {
            throw new Error(
                "AirtableMapping: content point moet een object zijn."
            );
        }

        const valueField =
            TYPE_TO_VALUE_FIELD[contentPoint.type];

        if (!valueField) {
            throw new Error(
                `Geen Airtable mapping voor content type: ${contentPoint.type}`
            );
        }

        return {
            contentId: contentPoint.id,

            target: {
                table: "Accommodatie Beoordelingen"
            },

            value: {
                field: valueField
            }
        };

    }

    static createMany(contentPoints) {

        if (!Array.isArray(contentPoints)) {
            throw new Error(
                "AirtableMapping: content points moet een array zijn."
            );
        }

        return contentPoints.map(point =>
            this.create(point)
        );

    }

    static isSupportedType(type) {

        return Object.prototype.hasOwnProperty.call(
            TYPE_TO_VALUE_FIELD,
            type
        );

    }

}

module.exports = AirtableMapping;