
require("dotenv").config();

const airtable = require("./services/airtableAdapter");
const updatePlanner = require("./services/updatePlanner");
const updateService = require("./services/updateService");
const rollbackService = require("./services/rollbackService");

(async () => {

    try {

        console.log("");
        console.log("================================");
        console.log("RZD Rollback Test");
        console.log("================================");
        console.log("");

        console.log("Stap 1 - Tabel ophalen");

        const table = await airtable.getTable("Accommodaties");

        console.log("✓ Stap 1 voltooid");

        console.log("Stap 2 - Veld zoeken");

        const field = table.fields.find(
            f => f.name === "Description Test"
        );

        console.log("✓ Stap 2 voltooid");

        if (!field) {

            console.log("❌ Veld 'Description Test' niet gevonden.");
            return;

        }

        console.log("");
        console.log("Table ID :", table.id);
        console.log("Field ID :", field.id);
        console.log("");

        console.log("Stap 3 - Builder veld maken");

        const builderField = {

            name: field.name,
            type: field.type,
            description: "Rollback Test Description",
            options: field.options || {}

        };

        console.log("✓ Stap 3 voltooid");

        console.log("Stap 4 - Rollback registreren");

        rollbackService.clear();

        rollbackService.register(
            table.id,
            field.id,
            builderField,
            field
        );

        console.log("✓ Stap 4 voltooid");

        console.log("Stap 5 - Payload bouwen");

        const payload = updatePlanner.build(
            builderField,
            field,
            ["description"]
        );

        console.log("✓ Stap 5 voltooid");

        console.log("");
        console.log("PATCH Payload");
        console.log("--------------------------------");

        console.dir(payload, {
            depth: null
        });

        console.log("");

        console.log("Stap 6 - Update uitvoeren");

        await updateService.updateField(
            table.id,
            field.id,
            payload
        );

        console.log("✓ Stap 6 voltooid");

        console.log("");
        console.log("Update uitgevoerd.");
        console.log("");

        console.log("Stap 7 - Rollback Stack tonen");

        rollbackService.print();

        console.log("✓ Stap 7 voltooid");

        console.log("");
        console.log("================================");
        console.log("TEST GESLAAGD");
        console.log("================================");
        console.log("");

    } catch (error) {

        console.log("");
        console.log("================================");
        console.log("TEST MISLUKT");
        console.log("================================");
        console.log("");

        console.error(error);

        console.log("");

    }

})();