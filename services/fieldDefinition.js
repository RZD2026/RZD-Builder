
const airtable = require("../services/airtableAdapter");
const logger = require("../services/logger");
const schemaValidator = require("../services/schemaValidator");
const FieldDefinition = require("../services/fieldDefinition");

async function buildModule(moduleName, options = {}) {

    const dryRun = options.dryRun === true;

    console.log("");
    console.log("================================");
    console.log("RZD Builder v1.4");
    console.log("================================");
    console.log("");

    logger.start(moduleName);

    let module;

    try {

        module = require(`../modules/${moduleName}`);

    } catch (err) {

        console.log(`❌ Module '${moduleName}' niet gevonden.`);
        logger.write(`FOUT: Module '${moduleName}' niet gevonden.`);
        return;

    }

    // Alle velden normaliseren
    module.fields = module.fields.map(field =>
        FieldDefinition.create(field)
    );

    const tableName = module.table || "Accommodaties";

    const errors = schemaValidator.validate(module);

    if (errors.length > 0) {

        console.log("");
        console.log("================================");
        console.log("SCHEMA VALIDATIE FOUTEN");
        console.log("================================");
        console.log("");

        logger.write("SCHEMA VALIDATIE FOUTEN");

        errors.forEach(error => {
            console.log(`❌ ${error}`);
            logger.write(error);
        });

        console.log("");
        console.log("Builder gestopt.");
        console.log("");

        logger.write("Builder gestopt.");

        return;

    }

    const existingFields = await airtable.getFieldNames(tableName);

    let exists = 0;
    let missing = 0;

    console.log(`Controle van module '${moduleName}'...`);
    console.log("");

    logger.write(`Controle module: ${moduleName}`);
    logger.write("");

    for (const field of module.fields) {

        if (existingFields.includes(field.name)) {

            console.log(`✓ ${field.name}`);
            logger.write(`BESTAAT : ${field.name}`);
            exists++;

        } else {

            console.log(`➕ ${field.name} (${field.type})`);
            logger.write(`ONTBREEKT : ${field.name} (${field.type})`);
            missing++;

        }

    }

    console.log("");
    console.log("--------------------------------");
    console.log("Samenvatting");
    console.log("--------------------------------");
    console.log(`Totaal      : ${module.fields.length}`);
    console.log(`Bestaan     : ${exists}`);
    console.log(`Ontbreken   : ${missing}`);
    console.log("");

    logger.write("");
    logger.write("Samenvatting");
    logger.write(`Totaal      : ${module.fields.length}`);
    logger.write(`Bestaan     : ${exists}`);
    logger.write(`Ontbreken   : ${missing}`);
    logger.write("");

    if (missing === 0) {

        console.log("✅ Alle velden bestaan al.");
        console.log("");

        logger.end(0, exists);
        return;

    }

    if (dryRun) {

        console.log("================================");
        console.log("DRY RUN");
        console.log("================================");
        console.log("");

        console.log("De volgende velden zouden worden aangemaakt:");
        console.log("");

        module.fields
            .filter(field => !existingFields.includes(field.name))
            .forEach(field => {

                console.log(`➕ ${field.name} (${field.type})`);
                logger.write(`DRY RUN : ${field.name} (${field.type})`);

            });

        console.log("");
        console.log("Geen wijzigingen uitgevoerd.");
        console.log("");

        logger.end(0, exists);

        return;

    }

    console.log("Ontbrekende velden worden aangemaakt...");
    console.log("");

    const result = await airtable.createMissingFields(
        tableName,
        module.fields
    );

    logger.end(result.created, result.skipped);

}

module.exports = {
    buildModule
};