
class ReportFormatter {

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

            if (result.action === "create") {

                console.log(`➕ ${result.field.name} (nieuw veld)`);
                return;

            }

            if (!result.comparison.hasDifferences) {

                console.log(`✓ ${result.field.name}`);
                return;

            }

            console.log(`⚠ ${result.field.name}`);

            this.printComparison(
                result.field.name,
                result.comparison.report
            );

        });

        console.log("");

    }

}

module.exports = new ReportFormatter();