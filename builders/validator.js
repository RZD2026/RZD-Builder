
const fs = require("fs");
const path = require("path");

const schemaValidator = require("../services/schemaValidator");

async function validateModules(moduleName = null) {

    console.log("");
    console.log("================================");
    console.log("RZD Builder Validator v1.0");
    console.log("================================");
    console.log("");

    const modulesPath = path.join(__dirname, "..", "modules");

    let files = fs.readdirSync(modulesPath)
        .filter(file => file.endsWith(".js"));

    if (moduleName) {

        files = files.filter(
            file => file === `${moduleName}.js`
        );

        if (files.length === 0) {

            console.log(`❌ Module '${moduleName}' niet gevonden.`);
            console.log("");

            return;

        }

    }

    let validModules = 0;
    let invalidModules = 0;
    let totalErrors = 0;

    for (const file of files) {

        const name = path.basename(file, ".js");

        delete require.cache[
            require.resolve(`../modules/${name}`)
        ];

        const module = require(`../modules/${name}`);

        const errors = schemaValidator.validate(module);

        if (errors.length === 0) {

            console.log(`✅ ${name}`);
            validModules++;

        } else {

            console.log(`❌ ${name}`);

            errors.forEach(error => {
                console.log(`   • ${error}`);
            });

            console.log("");

            invalidModules++;
            totalErrors += errors.length;

        }

    }

    console.log("");
    console.log("--------------------------------");
    console.log("Samenvatting");
    console.log("--------------------------------");
    console.log(`Modules gecontroleerd : ${files.length}`);
    console.log(`Geldig                : ${validModules}`);
    console.log(`Ongeldig              : ${invalidModules}`);
    console.log(`Totaal fouten         : ${totalErrors}`);
    console.log("");

    if (totalErrors === 0) {

        console.log("✅ Alle modules zijn geldig.");

    } else {

        console.log("❌ Validatie mislukt.");

    }

    console.log("");

}

module.exports = {
    validateModules
};