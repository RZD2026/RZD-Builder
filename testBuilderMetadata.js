
const builderMetadata =
    require("./services/builderMetadata");

console.log("");
console.log("================================");
console.log("Builder Metadata Test");
console.log("================================");
console.log("");

const metadata =
    builderMetadata.create({

        module: "test",

        table: "Accommodaties",

        runId: "TEST-RUN-ID",

        dryRun: true

    });

setTimeout(() => {

    builderMetadata.finish(metadata);

    builderMetadata.print(metadata);

    console.log("");
    console.log("================================");
    console.log("TEST GESLAAGD");
    console.log("================================");

}, 250);