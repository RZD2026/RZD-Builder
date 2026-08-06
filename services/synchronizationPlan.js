
const updatePlanner = require("./updatePlanner");

class SynchronizationPlan {

    build(results) {

        const plan = [];

        for (const result of results) {

            switch (result.action) {

                case "create":

                    plan.push({
                        action: "create",
                        field: result.field
                    });

                    break;

                case "skip":

                    plan.push({
                        action: "skip",
                        field: result.field
                    });

                    break;

                case "update":

                    plan.push({

                        action: "update",

                        field: result.field,

                        airtableField: result.airtableField,

                        update: updatePlanner.build(
                            result.field,
                            result.airtableField,
                            result.comparison.differences
                        ),

                        rollback: {

                            description:
                                result.airtableField.description || "",

                            options:
                                structuredClone(
                                    result.airtableField.options || {}
                                )

                        }

                    });

                    break;

            }

        }

        return plan;

    }

    print(plan) {

        console.log("");
        console.log("================================");
        console.log("Synchronization Plan");
        console.log("================================");
        console.log("");

        if (plan.length === 0) {

            console.log("Geen acties.");
            console.log("");

            return;

        }

        plan.forEach((item, index) => {

            console.log("--------------------------------");
            console.log(`${index + 1}. ${item.action.toUpperCase()}`);

            console.log(`Veld : ${item.field.name}`);

            if (item.action === "update") {

                console.log("");

                console.log("Update");

                console.dir(item.update, {
                    depth: null
                });

                console.log("");

                console.log("Rollback");

                console.dir(item.rollback, {
                    depth: null
                });

            }

            console.log("");

        });

    }

}

module.exports = new SynchronizationPlan();