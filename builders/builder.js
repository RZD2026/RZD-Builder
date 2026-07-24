const moduleLoader = require("../services/moduleLoader");

const airtable = require("../services/airtableAdapter");
const logger = require("../services/logger");
const schemaValidator = require("../services/schemaValidator");

const BuilderContext = require("../services/builderContext");

const comparisonService = require("../services/comparisonService");
const synchronizationPlan = require("../services/synchronizationPlan");
const reportFormatter = require("../services/reportFormatter");
const synchronizationService = require("../services/synchronizationService");

const auditService = require("../services/auditService");
const reportGenerator = require("../services/reportGenerator");

const builderMetadata = require("../services/builderMetadata");
const rollbackPlanner = require("../services/rollbackPlanner");
const runContextFactory = require("../services/runContextFactory");

async function buildModule(moduleName, options = {}) {

    const dryRun = options.dryRun === true;

    console.log("");
    console.log("================================");
    console.log("RZD Builder v1.7");
    console.log("================================");
    console.log("");

    logger.start(moduleName);

    auditService.clear();

    let module;

    try {

        module = await moduleLoader.load(moduleName);

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

    const airtableFields =
        await airtable.getFields(tableName);

    const context = new BuilderContext({

        module,
        tableName,
        airtableFields,
        logger,
        options

    });

    console.log("");
    console.log(`Controle van module '${moduleName}'...`);

    const results =
    comparisonService.compareModule(context);

    const plan =
    synchronizationPlan.build(results);

    const rollbackPlan =
    rollbackPlanner.build(plan);

    rollbackPlanner.print(rollbackPlan);

reportFormatter.printModuleComparison(results);

    const existing =
        results.filter(r => r.action !== "create").length;

    const missing =
        results.filter(r => r.action === "create").length;

    const changed =
        results.filter(r => r.action === "update").length;

    console.log("");
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

    console.log("");
    console.log("================================");
    console.log("Synchronisatie");
    console.log("================================");

    console.log(">>> Audit Run ID:", auditService.getRunId());

// Start metadata
const metadata =
    builderMetadata.create({

        module: moduleName,

        table: tableName,

        runId: auditService.getRunId(),

        dryRun

    });

const summary =
    await synchronizationService.execute(
        tableName,
        plan,
        {
            dryRun
        }
    );

// Eindtijd + duur berekenen
builderMetadata.finish(metadata);
builderMetadata.print(metadata);

    console.log(">>> Metadata Run ID:", metadata.runId);
    console.log("================================");
    console.log("Synchronisatie voltooid");
    console.log("================================");
    console.log("");

    console.log(`Nieuwe velden  : ${summary.created}`);
    console.log(`Bijgewerkt     : ${summary.updated}`);
    console.log(`Overgeslagen   : ${summary.skipped}`);
    console.log(`Waarschuwingen : ${summary.warnings}`);
    console.log(`Fouten         : ${summary.errors}`);

    logger.write("");
    logger.write("Synchronisatie");
    logger.write(`Nieuwe velden  : ${summary.created}`);
    logger.write(`Bijgewerkt     : ${summary.updated}`);
    logger.write(`Overgeslagen   : ${summary.skipped}`);
    logger.write(`Waarschuwingen : ${summary.warnings}`);
    logger.write(`Fouten         : ${summary.errors}`);

console.log("");
console.log("================================");
console.log("Rapporten genereren");
console.log("================================");
console.log("");

    const runContext =
    runContextFactory.create({

        metadata,

        auditService,

        synchronizationPlan: plan,

        rollbackPlan

    });

    const jsonReport =
    reportGenerator.saveJson(runContext);

    const markdownReport =
    reportGenerator.saveMarkdown(runContext);

    console.log("JSON");
    console.log(jsonReport);
    console.log("");

    console.log("Markdown");
    console.log(markdownReport);
    console.log("");

    logger.write("");
    logger.write("Rapporten");
    logger.write(jsonReport);
    logger.write(markdownReport);

    logger.end(
        summary.created,
        summary.skipped
    );

}

module.exports = {
    buildModule
};