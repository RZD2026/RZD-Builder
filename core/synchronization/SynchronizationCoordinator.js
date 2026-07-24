
const synchronizationService = require("../../services/synchronizationService");
const auditService = require("../../services/auditService");
const builderMetadata = require("../../services/builderMetadata");
const logger = require("../../services/logger");

class SynchronizationCoordinator {

    static async run({

        moduleName,
        tableName,
        plan,
        dryRun

    }) {

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

        const syncSummary =
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

        console.log(`Nieuwe velden  : ${syncSummary.created}`);
        console.log(`Bijgewerkt     : ${syncSummary.updated}`);
        console.log(`Overgeslagen   : ${syncSummary.skipped}`);
        console.log(`Waarschuwingen : ${syncSummary.warnings}`);
        console.log(`Fouten         : ${syncSummary.errors}`);

        logger.write("");
        logger.write("Synchronisatie");
        logger.write(`Nieuwe velden  : ${syncSummary.created}`);
        logger.write(`Bijgewerkt     : ${syncSummary.updated}`);
        logger.write(`Overgeslagen   : ${syncSummary.skipped}`);
        logger.write(`Waarschuwingen : ${syncSummary.warnings}`);
        logger.write(`Fouten         : ${syncSummary.errors}`);

        return {

    metadata,
    syncSummary,
    auditSummary: auditService.getSummary(),
    audit: auditService.getRecords()
};

    }

}

module.exports = SynchronizationCoordinator;