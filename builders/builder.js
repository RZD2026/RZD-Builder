
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

function initializeBuilder(moduleName) {

    console.log("");
    console.log("================================");
    console.log("RZD Builder v1.7");
    console.log("================================");
    console.log("");

    logger.start(moduleName);

    auditService.clear();

}

function validateModule(module) {

const errors = schemaValidator.validate(module);

    if (errors.length === 0) {
        return true;
    }

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

    return false;

}


async function buildModule(moduleName, options = {}) {

    const dryRun = options.dryRun === true;

    initializeBuilder(moduleName);

    let module;

    try {

        module = await moduleLoader.load(moduleName);

    } catch (err) {

        console.log(`❌ Module '${moduleName}' niet gevonden.`);
        logger.write(`FOUT: Module '${moduleName}' niet gevonden.`);

        return;

    }

    if (!validateModule(module)) {
        return;
    }

    const context =
          await createBuilderContext(module, options);

    const tableName =
          context.tableName;

    console.log("");
    console.log(`Controle van module '${moduleName}'...`);

    const {
        results,
        plan,
        rollbackPlan
    } = compareModule(context);

    printSummary(module, results);

    console.log("");
    console.log("================================");
    console.log("Synchronisatie");
    console.log("================================");

    console.log(">>> Audit Run ID:", auditService.getRunId());

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

    generateReports(runContext);;

    
    logger.end(
        summary.created,
        summary.skipped
    );

}

module.exports = {
    buildModule
};