
const toegang = require("../modules/toegang");
const airtable = require("../services/airtableAdapter");

async function buildModule(moduleName) {

    console.log("");
    console.log("================================");
    console.log("RZD Builder v1.0");
    console.log("================================");
    console.log("");

    let module;

    switch (moduleName) {

        case "toegang":
            module = toegang;
            break;

        default:
            console.log("❌ Onbekende module.");
            return;

    }

    const existingFields = await airtable.getFieldNames("Accommodaties");

    let exists = 0;
    let missing = 0;

    console.log("Controle van velden...");
    console.log("");

    for (const field of module.fields) {

        if (existingFields.includes(field.name)) {

            console.log("✓ " + field.name);
            exists++;

        } else {

            console.log("➕ " + field.name + " (" + field.type + ")");
            missing++;

        }

    }

    console.log("");
    console.log("--------------------------------");
    console.log("Samenvatting");
    console.log("--------------------------------");
    console.log("Totaal      : " + module.fields.length);
    console.log("Bestaan     : " + exists);
    console.log("Ontbreken   : " + missing);
    console.log("");

    if (missing > 0) {

        console.log("Ontbrekende velden worden aangemaakt...");
        console.log("");

        await airtable.createMissingFields(
            "Accommodaties",
            module.fields
        );

    } else {

        console.log("✅ Alle velden bestaan al.");
        console.log("");

    }

}

module.exports = {
    buildModule
};