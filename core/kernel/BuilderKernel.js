
const SynchronizationCoordinator = require("../synchronization/SynchronizationCoordinator");
const BuilderBootstrap = require("../bootstrap/BuilderBootstrap");
const BuilderWorkflow = require("../workflow/BuilderWorkflow");
const ReportingCoordinator = require("../reporting/ReportingCoordinator");
const logger = require("../../services/logger");

const rollbackPlanner = require("../../services/rollbackPlanner");

async function buildModule(moduleName, options = {}) {

    const dryRun = options.dryRun === true;
    let lifecycleCompleted = false;

    try {

        console.log("");
        console.log("================================");
        console.log("RZD Builder v2.0");
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

        await ReportingCoordinator.run({

            metadata,

            auditSummary,

            audit,

            synchronizationPlan: plan,

            rollbackPlan,

            syncSummary

        });

        lifecycleCompleted = true;

    } catch (error) {

        console.error(error);

        try {
            logger.write(`FOUT: ${error.message}`);
        } catch (loggingError) {
            console.error(loggingError);
        }

        throw error;

    } finally {

        if (!lifecycleCompleted) {

            try {
                logger.end(0, 0);
            } catch (loggingError) {
                console.error(loggingError);
            }

        }

    }
}

module.exports = {
    buildModule
};