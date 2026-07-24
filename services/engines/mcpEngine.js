const mcpService = require("../mcpService");

class McpEngine {

    constructor() {

        this.supported = new Set([
            "options.choices"
        ]);

    }

    supports(difference) {

        return this.supported.has(difference);

    }

    async execute(
        tableId,
        fieldId,
        updates
    ) {

        if (!Array.isArray(updates) || updates.length === 0) {
            return;
        }

        for (const update of updates) {

            switch (update.property) {

                case "options.choices":

                    await mcpService.call(
                        "airtable.field.updateChoices",
                        {
                            tableId,
                            fieldId,
                            choices: update.value
                        }
                    );

                    break;

                default:

                    console.log(
                        `Onbekende MCP property: ${update.property}`
                    );

            }

        }

    }

}

module.exports = new McpEngine();
