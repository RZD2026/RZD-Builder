const REVIEW_TABLE = "Accommodatie beoordelingen";

const REVIEW_FIELDS = {
    accommodation: "Accommodatie",
    point: "Beoordelingspunt",
    value: "Waarde / Resultaat",
    status: "Status",
    photo: "Foto / Bewijs",
    comment: "Opmerking"
};

const resolver =
    require("./airtablePointResolver");


class AirtableMapping {

    static async create(contentPoint, pointMapping) {

        if (!contentPoint || typeof contentPoint !== "object") {
            throw new Error(
                "AirtableMapping: content point moet een object zijn."
            );
        }

        if (!pointMapping || typeof pointMapping !== "object") {
            throw new Error(
                `AirtableMapping: geen Airtable mapping voor '${contentPoint.id}'.`
            );
        }

        const resolved =
            await resolver.resolve(pointMapping);

        if (resolved.status === "NO_MATCH") {

            return {
                contentId: contentPoint.id,

                status: "NO_MATCH",

                point: {
                    table: "Beoordelingspunten",
                    recordId: null,
                    field: "Beoordelingspunt",
                    name: null
                },

                review: {
                    table: REVIEW_TABLE,

                    links: {
                        accommodation: REVIEW_FIELDS.accommodation,
                        point: REVIEW_FIELDS.point
                    },

                    value: {
                        field: REVIEW_FIELDS.value
                    },

                    status: {
                        field: REVIEW_FIELDS.status
                    },

                    photo: {
                        field: REVIEW_FIELDS.photo
                    },

                    comment: {
                        field: REVIEW_FIELDS.comment
                    }
                }
            };
        }

        return {

            contentId: contentPoint.id,

            status: resolved.status,

            point: {
                table: "Beoordelingspunten",
                recordId: resolved.recordId,
                field: "Beoordelingspunt",
                name: resolved.name
            },

            review: {
                table: REVIEW_TABLE,

                links: {
                    accommodation: REVIEW_FIELDS.accommodation,
                    point: REVIEW_FIELDS.point
                },

                value: {
                    field: REVIEW_FIELDS.value
                },

                status: {
                    field: REVIEW_FIELDS.status
                },

                photo: {
                    field: REVIEW_FIELDS.photo
                },

                comment: {
                    field: REVIEW_FIELDS.comment
                }
            }

        };

    }


    static async createMany(contentPoints, pointMappings) {

        if (!Array.isArray(contentPoints)) {
            throw new Error(
                "AirtableMapping: content points moet een array zijn."
            );
        }

        if (!pointMappings || typeof pointMappings !== "object") {
            throw new Error(
                "AirtableMapping: point mappings ontbreken."
            );
        }

        return Promise.all(
            contentPoints.map(point => {

                const mapping =
                    pointMappings[point.id];

                return this.create(
                    point,
                    mapping
                );

            })
        );

    }


    static isSupportedType(type) {

        return [
            "checkbox",
            "number",
            "text",
            "longtext",
            "select",
            "attachment"
        ].includes(type);

    }

}


module.exports = AirtableMapping;