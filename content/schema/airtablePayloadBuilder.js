class AirtablePayloadBuilder {

    async buildCreateTablePayload(
        table,
        airtableAdapter,
        tableIdMap = {}
    ) {

        if (!table || !table.name) {
            throw new Error(
                "AirtablePayloadBuilder: tabelnaam ontbreekt."
            );
        }

        const fields = [];

        for (const field of table.fields || []) {

            fields.push(
                await this.buildFieldPayload(
                    field,
                    airtableAdapter,
                    tableIdMap
                )
            );

        }

        return {
            name: table.name,
            fields
        };

    }

    async buildFieldPayload(
        field,
        airtableAdapter,
        tableIdMap
    ) {

        if (!field || !field.name) {
            throw new Error(
                "AirtablePayloadBuilder: veldnaam ontbreekt."
            );
        }

        const payload = {
            name: field.name,
            type: field.type
        };

        if (field.description) {

            payload.description =
                field.description;

        }

        /*
         * Linked record
         */
        if (field.linkedTable) {

            let linkedTableId =
                tableIdMap[field.linkedTable];

            if (!linkedTableId) {

                linkedTableId =
                    await airtableAdapter.getTableId(
                        field.linkedTable
                    );

            }

            if (!linkedTableId) {

                throw new Error(
                    `Geen Airtable table ID gevonden voor '${field.linkedTable}'.`
                );

            }

            payload.options = {
                linkedTableId
            };

            return payload;
        }

        /*
         * SingleSelect / MultiSelect choices
         */
        if (field.choices) {

            if (!Array.isArray(field.choices)) {

                throw new Error(
                    `Choices van '${field.name}' moeten een array zijn.`
                );

            }

            if (field.choices.length === 0) {

                throw new Error(
                    `SingleSelect '${field.name}' heeft geen choices.`
                );

            }

            payload.options = {
                choices: field.choices.map(
                    choice => ({
                        name:
                            typeof choice === "string"
                                ? choice
                                : choice.name
                    })
                )
            };

            return payload;
        }

        /*
         * Overige Airtable options
         */
        if (field.options) {

            payload.options =
                field.options;

        }

        return payload;

    }

}

module.exports = new AirtablePayloadBuilder();