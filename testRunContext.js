
const runContextFactory =
    require("./services/runContextFactory");

const auditService =
    require("./services/auditService");

console.log("");
console.log("================================");
console.log("RZD RunContext Test");
console.log("================================");
console.log("");

// Nieuwe audit-run
auditService.clear();

auditService.add({

    action: "create",
    field: "Naam"

});

auditService.add({

    action: "update",
    field: "Beschrijving"

});

const metadata = {

    builder: "RZD Builder",
    version: "2.0.0-rc1",
    module: "test",
    table: "Accommodaties"

};

const synchronizationPlan = [

    {
        action: "create",
        field: {
            name: "Naam"
        }
    }

];

const rollbackPlan = [

    {
        action: "rollback-create",
        field: {
            name: "Naam"
        }
    }

];

const runContext =
    runContextFactory.create({

        metadata,

        auditService,

        synchronizationPlan,

        rollbackPlan

    });

console.log("RunContext");
console.log("--------------------------------");

console.dir(runContext, {
    depth: null
});

console.log("");

console.log("Controle");
console.log("--------------------------------");

console.log(
    "Metadata      :",
    runContext.metadata !== undefined
);

console.log(
    "Summary       :",
    runContext.summary !== undefined
);

console.log(
    "Sync Plan     :",
    runContext.synchronizationPlan.length
);

console.log(
    "Rollback Plan :",
    runContext.rollbackPlan.length
);

console.log(
    "Audit Records :",
    runContext.auditService.getRecords().length
);

console.log("");

console.log("================================");
console.log("TEST GESLAAGD");
console.log("================================");