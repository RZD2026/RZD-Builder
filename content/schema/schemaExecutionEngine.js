const AirtablePayloadBuilder =
    require("./airtablePayloadBuilder");

class SchemaExecutionEngine {

    constructor() {

        this.payloadBuilder =
            AirtablePayloadBuilder;

    }

    async execute(
        plan,
        airtableAdapter,
        options = {}
    ) {

        if (!Array.isArray(plan)) {
            throw new Error(
                "SchemaExecutionEngine: plan moet een array zijn."
            );
        }

        if (!airtableAdapter) {
            throw new Error(
                "SchemaExecutionEngine: AirtableAdapter ontbreekt."
            );
        }

        const dryRun =
            options.dryRun !== false;

        const execute =
            options.execute === true;

        if (!dryRun && !execute) {
            throw new Error(
                "SchemaExecutionEngine: echte uitvoering vereist execute: true."
            );
        }

        if (dryRun && execute) {
            throw new Error(
                "SchemaExecutionEngine: dryRun en execute mogen niet tegelijk actief zijn."
            );
        }

        const tableIdMap = {};
        const results = [];

        const existingTables =
            await airtableAdapter.getTables();

        for (const table of existingTables) {

            tableIdMap[table.name] =
                table.id;

        }

        if (dryRun) {

            let simulatedId = 1;

            for (const item of plan) {

                if (
                    item.action === "createTable" &&
                    !tableIdMap[item.table]
                ) {

                    tableIdMap[item.table] =
                        `tblDRYRUN${String(simulatedId).padStart(3, "0")}`;

                    simulatedId++;

                }

            }

        }

        for (const item of plan) {

            if (item.action === "skip") {

                results.push({
                    action: "skip",
                    table: item.table,
                    status: "skipped",
                    tableId:
                        tableIdMap[item.table] || null
                });

                continue;
            }

            if (item.action !== "createTable") {

                results.push({
                    action: item.action,
                    table: item.table,
                    status: "not-executed"
                });

                continue;
            }

            const fields =
                (item.fields || []).map(
                    fieldPlan => {

                        const field = {
                            name: fieldPlan.field,
                            type: fieldPlan.type
                        };

                        if (fieldPlan.link) {

                            field.linkedTable =
                                fieldPlan.link.linkedTable;

                        }

                        if (fieldPlan.options) {

                            field.options =
                                fieldPlan.options;

                        }
                        
                        if (fieldPlan.choices) {

                             field.choices =
                                 fieldPlan.choices;

}

                        return field;
                    }
                );

            const payload =
                await this.payloadBuilder
                    .buildCreateTablePayload(
                        {
                            name: item.table,
                            fields
                        },
                        airtableAdapter,
                        tableIdMap
                    );

            if (dryRun) {

                results.push({
                    action: "createTable",
                    table: item.table,
                    status: "dry-run",
                    simulatedTableId:
                        tableIdMap[item.table],
                    payload
                });

                continue;
            }

            const created =
                await airtableAdapter.createTable(
                    payload
                );

            if (!created || !created.id) {

                throw new Error(
                    `Airtable gaf geen table ID terug voor '${item.table}'.`
                );
            }

            tableIdMap[item.table] =
                created.id;

            results.push({
                action: "createTable",
                table: item.table,
                status: "created",
                tableId: created.id
            });

        }

        return {
            dryRun,
            execute,
            tableIdMap,
            results
        };

    }

}

module.exports = new SchemaExecutionEngine();