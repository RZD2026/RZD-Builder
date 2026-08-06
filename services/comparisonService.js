
const fieldComparer = require("./fieldComparer");
const differenceEngine = require("./differenceEngine");

class ComparisonService {

    compare(localField, airtableField) {

        const differences = fieldComparer.compare(
            localField,
            airtableField
        );

        if (differences.length === 0) {

            return {
                hasDifferences: false,
                differences: [],
                report: []
            };

        }

        const report = differenceEngine.build(
            localField,
            airtableField,
            differences
        );

        return {
            hasDifferences: true,
            differences,
            report
        };

    }

    compareModule(context) {

        const results = [];

        for (const localField of context.module.fields) {

            const airtableField = context.getField(localField.name);

            // Nieuw veld
            if (!airtableField) {

                results.push({
                    action: "create",
                    field: localField,
                    airtableField: null,
                    comparison: null
                });

                continue;

            }

            const comparison = this.compare(
                localField,
                airtableField
            );

            // Bestaand veld zonder verschillen
            if (!comparison.hasDifferences) {

                results.push({
                    action: "skip",
                    field: localField,
                    airtableField,
                    comparison
                });

                continue;

            }

            // Bestaand veld met verschillen
            results.push({
                action: "update",
                field: localField,
                airtableField,
                comparison
            });

        }

        return results;

    }

}

module.exports = new ComparisonService();