require("dotenv").config();

const airtable = require("./services/airtableAdapter");
const updateService = require("./services/updateService");

(async () => {

    console.log("");
    console.log("================================");
    console.log("RZD UpdateService Test");
    console.log("================================");
    console.log("");

    const table = await airtable.getTable("Accommodaties");

    const field = table.fields.find(
        f => f.name === "Description Test"
    );

    if (!field) {

        console.log("❌ Veld 'Description Test' niet gevonden.");
        return;

    }

    console.log("Table ID :", table.id);
    console.log("Field ID :", field.id);
    console.log("");

    const payload = {
        description: "Test description vanuit UpdateService"
    };

    await updateService.updateField(
        table.id,
        field.id,
        payload
    );

    console.log("");
    console.log("✅ Test voltooid.");
    console.log("");

})();