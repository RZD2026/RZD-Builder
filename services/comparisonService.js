const fieldComparer = require("./fieldComparer");
const differenceEngine = require("./differenceEngine");
const reportFormatter = require("./reportFormatter");

class ComparisonService {

    compare(localField, airtableField) {

        // Stap 1 - Zoek verschillen
        const differences = fieldComparer.compare(
            localField,
            airtableField
        );

        // Geen verschillen
        if (differences.length === 0) {

            return {
                hasDifferences: false,
                differences: [],
                report: null
            };

        }

        // Stap 2 - Bouw difference report
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

    print(fieldName, comparison) {

        if (!comparison.hasDifferences) {

            console.log(`✓ ${fieldName}`);

            return;

        }

        console.log(`⚠ ${fieldName}`);

        reportFormatter.createDifferenceReport(
            fieldName,
            comparison.report
        );

    }

}

module.exports = new ComparisonService();