
const SynchronizationCoordinator = require("../synchronization/SynchronizationCoordinator");
const BuilderBootstrap = require("../bootstrap/BuilderBootstrap");
const BuilderWorkflow = require("../workflow/BuilderWorkflow");
const logger = require("../../services/logger");

const reportGenerator = require("../../services/reportGenerator");

const rollbackPlanner = require("../../services/rollbackPlanner");
const runContextFactory = require("../../services/runContextFactory");

async function buildModule(moduleName, options = {}) {

    const dryRun = options.dryRun === true;

    console.log("");
    console.log("================================");
    console.log("RZD Builder v1.7");
    console.log("================================");
    console.log("");

    const bootstrap =
        await BuilderBootstrap.create(moduleName, options);

    if (!bootstrap) {
        return;
    }

    const {
        module,
        tableName
    } = bootstrap;

    const {
        results,
        plan,
        rollbackPlan,
        summary
    } = await BuilderWorkflow.run(bootstrap);

    rollbackPlanner.print(rollbackPlan);

    console.log("");
    console.log("--------------------------------");
    console.log("Samenvatting");
    console.log("--------------------------------");
    console.log(`Totaal      : ${module.fields.length}`);
    console.log(`Bestaan     : ${summary.existing}`);
    console.log(`Ontbreken   : ${summary.missing}`);
    console.log(`Gewijzigd   : ${summary.changed}`);
    console.log("");

    logger.write("");
    logger.write("Samenvatting");
    logger.write(`Totaal      : ${module.fields.length}`);
    logger.write(`Bestaan     : ${summary.existing}`);
    logger.write(`Ontbreken   : ${summary.missing}`);
    logger.write(`Gewijzigd   : ${summary.changed}`);
    logger.write("");

   const {
    metadata,
    syncSummary,
    auditSummary,
    audit
} = await SynchronizationCoordinator.run({

    moduleName,

    tableName,

    plan,

    dryRun

});

    logger.write("");
    logger.write("Synchronisatie");
    logger.write(`Nieuwe velden  : ${syncSummary.created}`);
    logger.write(`Bijgewerkt     : ${syncSummary.updated}`);
    logger.write(`Overgeslagen   : ${syncSummary.skipped}`);
    logger.write(`Waarschuwingen : ${syncSummary.warnings}`);
    logger.write(`Fouten         : ${syncSummary.errors}`);

    console.log("");
    console.log("================================");
    console.log("Rapporten genereren");
    console.log("================================");
    console.log("");

    const runContext =
    runContextFactory.create({

        metadata,

        auditSummary,

        audit,

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
        syncSummary.created,
        syncSummary.skipped
    );

}

module.exports = {
    buildModule
};