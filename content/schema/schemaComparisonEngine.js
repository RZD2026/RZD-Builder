const fieldAliases = require("./fieldAliases");

class SchemaComparisonEngine {

    compare(desiredSchema, airtableSchema) {

        if (!desiredSchema || typeof desiredSchema !== "object") {
            throw new Error(
                "SchemaComparisonEngine: gewenst schema ontbreekt."
            );
        }

        if (!Array.isArray(desiredSchema.tables)) {
            throw new Error(
                "SchemaComparisonEngine: gewenst schema bevat geen tables."
            );
        }

        if (!Array.isArray(airtableSchema)) {
            throw new Error(
                "SchemaComparisonEngine: Airtable schema moet een array zijn."
            );
        }

        const results = [];

        for (const desiredTable of desiredSchema.tables) {

            const existingTable =
                airtableSchema.find(
                    table => table.name === desiredTable.name
                );

            if (!existingTable) {

                results.push({
                    action: "create",
                    table: desiredTable.name,
                    desired: desiredTable,
                    airtable: null,
                    differences: []
                });

                continue;
            }

            const differences =
                this.compareFields(
                    desiredTable.fields || [],
                    existingTable.fields || []
                );

            const hasCreates =
                differences.some(
                    difference =>
                        difference.action === "create"
                );

            const hasUpdates =
                differences.some(
                    difference =>
                        difference.action === "update"
                );

            let action = "skip";

            if (hasUpdates || hasCreates) {
                action = "update";
            }

            results.push({
                action,
                table: desiredTable.name,
                desired: desiredTable,
                airtable: existingTable,
                differences
            });

        }

        return results;

    }

    compareFields(desiredFields, airtableFields) {

        const results = [];

        for (const desiredField of desiredFields) {

            const airtableName =
                this.resolveFieldName(desiredField.name);

            const existingField =
                airtableFields.find(
                    field =>
                        field.name === airtableName
                );

            if (!existingField) {

                results.push({
                    action: "create",
                    field: desiredField,
                    airtableField: null,
                    differences: []
                });

                continue;

            }

            const differences =
                this.compareField(
                    desiredField,
                    existingField
                );

            if (differences.length === 0) {

                results.push({
                    action: "skip",
                    field: desiredField,
                    airtableField: existingField,
                    differences: []
                });

                continue;

            }

            results.push({
                action: "update",
                field: desiredField,
                airtableField: existingField,
                differences
            });

        }

        return results;

    }

    resolveFieldName(desiredFieldName) {

        return (
            fieldAliases[desiredFieldName] ||
            desiredFieldName
        );

    }

    compareField(desiredField, airtableField) {

        const differences = [];

        if (
            desiredField.type &&
            airtableField.type &&
            desiredField.type !== airtableField.type
        ) {

            differences.push({
                property: "type",
                desired: desiredField.type,
                actual: airtableField.type
            });

        }

        if (
            desiredField.description &&
            desiredField.description !==
                airtableField.description
        ) {

            differences.push({
                property: "description",
                desired: desiredField.description,
                actual:
                    airtableField.description || null
            });

        }

        return differences;

    }

    summarize(results) {

        const summary = {

            tables: {
                create: 0,
                update: 0,
                skip: 0
            },

            fields: {
                create: 0,
                update: 0,
                skip: 0
            }

        };

        for (const result of results) {

            summary.tables[result.action]++;

            for (const difference of result.differences) {

                summary.fields[difference.action]++;

            }

        }

        return summary;

    }

}

module.exports = new SchemaComparisonEngine();