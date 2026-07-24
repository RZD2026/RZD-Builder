
const reportGenerator = require("../../services/reportGenerator");
const runContextFactory = require("../../services/runContextFactory");
const logger = require("../../services/logger");

async function run({

    metadata,

    auditSummary,

    audit,

    synchronizationPlan,

    rollbackPlan,

    syncSummary

}) {

    const runContext =
        runContextFactory.create({

            metadata,

            auditSummary,

            audit,

            synchronizationPlan,

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
    run
};