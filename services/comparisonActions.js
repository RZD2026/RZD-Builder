const ACTIONS = Object.freeze({
const ACTIONS = require("./comparisonActions");
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

            // Veld bestaat nog niet
            if (!airtableField) {

                results.push({
                    action: ACTIONS.CREATE,
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

            // Geen verschillen
            if (!comparison.hasDifferences) {

                results.push({
                    action: ACTIONS.SKIP,
                    field: localField,
                    airtableField,
                    comparison
                });

                continue;

            }

            // Wel verschillen
            results.push({
                action: ACTIONS.UPDATE,
                field: localField,
                airtableField,
                comparison
            });

        }

        return results;

    }

}

module.exports = new ComparisonService();