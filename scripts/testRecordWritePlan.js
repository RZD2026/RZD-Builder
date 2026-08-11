const loader =
    require("../services/contentModuleLoader");

const pointMappings =
    require("../content/mapping/pointMappings");

const airtableMapping =
    require("../content/mapping/airtableMapping");


async function run() {

    console.log("");
    console.log("===== RZD 5.1 RECORD WRITE PLAN DRY-RUN =====");
    console.log("");

    const module =
        await loader.load("toegang");

    const mappings =
        await airtableMapping.createMany(
            module.points,
            pointMappings
        );

    const plan = [];

    for (const mapping of mappings) {

        if (mapping.status === "NO_MATCH") {

            plan.push({
                action: "skip",
                contentId: mapping.contentId,
                reason: "NO_MATCH"
            });

            continue;
        }

        plan.push({
            action: "create",
            table: mapping.review.table,
            contentId: mapping.contentId,
            pointRecordId: mapping.point.recordId,
            pointName: mapping.point.name,
            fields: {
                [mapping.review.links.point]:
                    [mapping.point.recordId]
            }
        });

    }

    for (const item of plan) {

        console.log("--------------------------------");
        console.log(`Actie:          ${item.action}`);
        console.log(`Content ID:     ${item.contentId}`);

        if (item.action === "skip") {

            console.log(`Reden:          ${item.reason}`);
            continue;

        }

        console.log(`Tabel:          ${item.table}`);
        console.log(`Beoordelingspunt: ${item.pointName}`);
        console.log(`Record ID:      ${item.pointRecordId}`);
        console.log("Velden:");
        console.dir(item.fields, {
            depth: null
        });

    }

    console.log("");
    console.log(`Aantal plannen: ${plan.length}`);

    console.log("");
    console.log("===== RECORD WRITE PLAN DRY-RUN GESLAAGD =====");
    console.log("");

}


run().catch(error => {

    console.error("");
    console.error("===== DRY-RUN MISLUKT =====");
    console.error("");
    console.error(error);
    process.exit(1);

});