class ReportFormatter {

    getFieldName(field) {

        return (
            field?.labels?.airtable ??
            field?.name ??
            field?.id ??
            "Onbekend veld"
        );

    }

    printComparison(fieldName, report) {

        console.log("");
        console.log("================================");
        console.log(`Veld: ${fieldName}`);
        console.log("================================");
        console.log("");

        if (!report || report.length === 0) {

            console.log("✓ Geen verschillen gevonden.");
            console.log("");

            return;

        }

        report.forEach(item => {

            console.log("--------------------------------");
            console.log(`Eigenschap : ${item.property}`);
            console.log("");

            console.log("Builder");
            console.log("--------------------------------");
            console.log(item.local);

            console.log("");

            console.log("Airtable");
            console.log("--------------------------------");
            console.log(item.remote);

            console.log("");

        });

    }

    printModuleComparison(results) {

        console.log("");
        console.log("================================");
        console.log("Vergelijkingsrapport");
        console.log("================================");
        console.log("");

        results.forEach(result => {

            const fieldName = this.getFieldName(result.field);

            if (result.action === "create") {

                console.log(`➕ ${fieldName} (nieuw veld)`);
                return;

            }

            if (!result.comparison.hasDifferences) {

                console.log(`✓ ${fieldName}`);
                return;

            }

            console.log(`⚠ ${fieldName}`);

            this.printComparison(
                fieldName,
                result.comparison.report
            );

        });

        console.log("");

    }

}

module.exports = new ReportFormatter();
