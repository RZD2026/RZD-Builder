
const airtable = require("./airtableAdapter");
const updateService = require("./updateService");
const auditService = require("./auditService");
const mcpEngine = require("./engines/mcpEngine");
const { updateChoices } = require("./engines/choicesEngine");

class SynchronizationService {

    async execute(tableName, plan, options = {}) {

        const dryRun = options.dryRun === true;

        const table = await airtable.getTable(tableName);

        const summary = {
            created: 0,
            updated: 0,
            skipped: 0,
            warnings: 0,
            errors: 0
        };

        for (const item of plan) {

            try {

                switch (item.action) {

                    case "create":

                        summary.created++;

                        auditService.add({

                            action: "create",
                            field: item.field.name,
                            type: item.field.type

                        });

                        console.log(`➕ ${item.field.name}`);

                        if (!dryRun) {

                            await airtable.createField(
                                tableName,
                                item.field
                            );

                        }

                        break;

                    case "skip":

                        summary.skipped++;

                        auditService.add({

                            action: "skip",
                            field: item.field.name

                        });

                        console.log(`✓ ${item.field.name}`);

                        break;

                    case "update":

                        summary.updated++;

                        console.log(`⚠ ${item.field.name}`);

                        if (!item.update) {

                            summary.warnings++;

                            auditService.add({

                                action: "warning",
                                field: item.field.name,
                                message: "Geen wijzigingen."

                            });

                            console.log("Geen wijzigingen.");
                            break;

                        }

                        auditService.add({

                            action: "update",

                            field: item.field.name,

                            before: item.rollback,

                            after: item.update

                        });

                        if (dryRun) {

                            console.log("");
                            console.log("DRY RUN");

                            console.dir(item.update, {
                                depth: null
                            });

                            console.log("");

                            break;

                        }

                        if (
                            item.update.metadata &&
                            Object.keys(item.update.metadata).length > 0
                        ) {

                            await updateService.updateField(

                                table.id,
                                item.airtableField.id,
                                item.update.metadata

                            );

                        }

                        if (
                            item.update.metadata?.options?.choices &&
                            Array.isArray(item.update.metadata.options.choices)
                        ) {

                            await updateChoices(

                                table.id,
                                table.id,
                                item.airtableField.id,
                                item.update.metadata.options.choices

                            );

                        }

                        if (
                            Array.isArray(item.update.mcp) &&
                            item.update.mcp.length > 0
                        ) {

                            await mcpEngine.execute(

                                table.id,
                                item.airtableField.id,
                                item.update.mcp

                            );

                        }

                        break;

                }

            } catch (error) {

                summary.errors++;

                auditService.add({

                    action: "error",

                    field: item.field?.name,

                    message: error.message

                });

                console.log("");
                console.log("❌ Synchronisatiefout");
                console.log(error.message);
                console.log("");

            }

        }

        auditService.finishRun();

        auditService.printSummary();

        return summary;

    }

}

module.exports = new SynchronizationService();