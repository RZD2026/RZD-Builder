
const updateService = require("./updateService");

class RollbackService {

    constructor() {

        this.clear();

    }

    clear() {

        this.stack = [];

    }

    register(tableId, fieldId, localField, airtableField) {

        this.stack.push({

            tableId,
            fieldId,

            timestamp: new Date().toISOString(),

            before: {

                name: airtableField.name,
                type: airtableField.type,
                description: airtableField.description || "",
                options: structuredClone(
                    airtableField.options || {}
                )

            },

            after: {

                name: localField.name,
                type: localField.type,
                description: localField.description || "",
                options: structuredClone(
                    localField.options || {}
                )

            }

        });

    }

    async rollback() {

        console.log("");
        console.log("================================");
        console.log("ROLLBACK");
        console.log("================================");
        console.log("");

        if (this.stack.length === 0) {

            console.log("Geen rollback nodig.");
            console.log("");

            return;

        }

        for (let i = this.stack.length - 1; i >= 0; i--) {

            const item = this.stack[i];

            const payload = {};

            payload.description = item.before.description;

            if (
                item.before.options &&
                Object.keys(item.before.options).length > 0
            ) {

                payload.options = structuredClone(
                    item.before.options
                );

            }

            console.log(`↩ ${item.before.name}`);

            await updateService.updateField(
                item.tableId,
                item.fieldId,
                payload
            );

        }

        console.log("");
        console.log("Rollback voltooid.");
        console.log("");

    }

    getAll() {

        return this.stack;

    }

    count() {

        return this.stack.length;

    }

    print() {

        console.log("");
        console.log("================================");
        console.log("Rollback Stack");
        console.log("================================");
        console.log("");

        if (this.stack.length === 0) {

            console.log("Geen rollback-items.");
            console.log("");

            return;

        }

        this.stack.forEach((item, index) => {

            console.log("--------------------------------");
            console.log(`Rollback ${index + 1}`);
            console.log("--------------------------------");

            console.log(`Table : ${item.tableId}`);
            console.log(`Field : ${item.fieldId}`);

            console.log("");

            console.log("Voor");

            console.dir(item.before, {
                depth: null
            });

            console.log("");

            console.log("Na");

            console.dir(item.after, {
                depth: null
            });

            console.log("");

        });

    }

}

module.exports = new RollbackService();