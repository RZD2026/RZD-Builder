
const rollbackPlanner = require("./services/rollbackPlanner");

console.log("");
console.log("================================");
console.log("RZD RollbackPlanner Test");
console.log("================================");
console.log("");

const synchronizationPlan = [

    {
        action: "create",

        field: {
            name: "Nieuw Veld",
            type: "singleLineText"
        }
    },

    {
        action: "skip",

        field: {
            name: "Bestaand Veld"
        }
    },

    {
        action: "update",

        field: {
            name: "Description Test"
        },

        airtableField: {
            id: "fld123456"
        },

        update: {

            description: "Nieuwe description",

            options: {
                precision: 1
            }

        },

        rollback: {

            description: "Oude description",

            options: {
                precision: 0
            }

        }

    }

];

console.log("Synchronization Plan");
console.log("--------------------------------");

console.dir(
    synchronizationPlan,
    {
        depth: null
    }
);

console.log("");

const rollbackPlan =
    rollbackPlanner.build(
        synchronizationPlan
    );

rollbackPlanner.print(
    rollbackPlan
);

console.log("");

console.log("================================");
console.log("Controle");
console.log("================================");
console.log("");

console.log(
    `Synchronization acties : ${synchronizationPlan.length}`
);

console.log(
    `Rollback acties        : ${rollbackPlan.length}`
);

console.log("");

console.log("================================");
console.log("TEST GESLAAGD");
console.log("================================");
console.log("");