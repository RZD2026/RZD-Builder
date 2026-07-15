
const airtable = require("../services/airtableAdapter");
const logger = require("../services/logger");
const schemaValidator = require("../services/schemaValidator");
const BuilderContext = require("../services/builderContext");
const comparisonService = require("../services/comparisonService");
const reportFormatter = require("../services/reportFormatter");

async function buildModule(moduleName, options = {}) {

    const dryRun = options.dryRun === true;

    console.log("");
    console.log("================================");
    console.log("RZD Builder v1.5");
    console.log("================================");
    console.log("");

    logger.start(moduleName);

    let module;

    try {

        delete require.cache[require.resolve(`../modules/${moduleName}`)];
        module = require(`../modules/${moduleName}`);

    } catch (err) {

        console.log(`❌ Module '${moduleName}' niet gevonden.`);
        logger.write(`FOUT: Module '${moduleName}' niet gevonden.`);
        return;

    }

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

            console.log("❌ " + error);
            logger.write(error);

        });

        console.log("");
        console.log("Builder gestopt.");
        console.log("");

        logger.write("Builder gestopt.");

        return;

    }

    const airtableFields = await airtable.getFields(tableName);

    const context = new BuilderContext({
        module,
        tableName,
        airtableFields,
        logger,
        options
    });

    console.log(`Controle van module '${moduleName}'...`);

    const results = comparisonService.compareModule(context);

    reportFormatter.printModuleComparison(results);

    const existing = results.filter(r => r.action !== "create").length;
    const missing = results.filter(r => r.action === "create").length;
    const changed = results.filter(r => r.action === "update").length;

    console.log("--------------------------------");
    console.log("Samenvatting");
    console.log("--------------------------------");
    console.log(`Totaal      : ${module.fields.length}`);
    console.log(`Bestaan     : ${existing}`);
    console.log(`Ontbreken   : ${missing}`);
    console.log(`Gewijzigd   : ${changed}`);
    console.log("");

    logger.write("");
    logger.write("Samenvatting");
    logger.write(`Totaal      : ${module.fields.length}`);
    logger.write(`Bestaan     : ${existing}`);
    logger.write(`Ontbreken   : ${missing}`);
    logger.write(`Gewijzigd   : ${changed}`);
    logger.write("");

    if (missing === 0) {

        console.log("✅ Geen nieuwe velden om aan te maken.");
        console.log("");

        logger.end(0, existing);

        return;

    }

    if (dryRun) {

        console.log("================================");
        console.log("DRY RUN");
        console.log("================================");
        console.log("");

        results
            .filter(r => r.action === "create")
            .forEach(r => {

                console.log(`➕ ${r.field.name} (${r.field.type})`);
                logger.write(`DRY RUN : ${r.field.name}`);

            });

        console.log("");
        console.log("Geen wijzigingen uitgevoerd.");
        console.log("");

        logger.end(0, existing);

        return;

    }

    console.log("Nieuwe velden worden aangemaakt...");
    console.log("");

    const fieldsToCreate = results
        .filter(r => r.action === "create")
        .map(r => r.field);

    const result = await airtable.createMissingFields(
        tableName,
        fieldsToCreate
    );

    logger.end(result.created, result.skipped);

}

module.exports = {
    buildModule
};