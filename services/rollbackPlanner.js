
class RollbackPlanner {

    build(plan) {

        const rollbackPlan = [];

        for (const item of plan) {

            switch (item.action) {

                case "update":

                    rollbackPlan.push({

                        action: "rollback-update",

                        field: item.field,

                        airtableField: item.airtableField,

                        payload: structuredClone(
                            item.rollback
                        )

                    });

                    break;

                case "create":

                    rollbackPlan.push({

                        action: "rollback-create",

                        field: item.field

                    });

                    break;

                case "skip":

                    break;

            }

        }

        return rollbackPlan.reverse();

    }

    print(plan) {

        console.log("");
        console.log("================================");
        console.log("Rollback Plan");
        console.log("================================");
        console.log("");

        if (plan.length === 0) {

            console.log("Geen rollback-acties.");
            console.log("");

            return;

        }

        plan.forEach((item, index) => {

            console.log("--------------------------------");
            console.log(`${index + 1}. ${item.action}`);
            console.log("--------------------------------");

            console.log(`Veld : ${item.field.name}`);

            if (item.payload) {

                console.log("");

                console.log("Payload");

                console.dir(item.payload, {
                    depth: null
                });

            }

            console.log("");

        });

    }

}

module.exports = new RollbackPlanner();