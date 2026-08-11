const loader =
    require("../services/contentModuleLoader");

const pointMappings =
    require("../content/mapping/pointMappings");

const airtableMapping =
    require("../content/mapping/airtableMapping");


async function run() {

    console.log("");
    console.log("===== RZD 5.1 RECORD MAPPING DRY-RUN =====");
    console.log("");

    const module =
        await loader.load("toegang");

    const mappings =
        await airtableMapping.createMany(
            module.points,
            pointMappings
        );

    for (const mapping of mappings) {

        console.log("--------------------------------");
        console.log(`Content ID:    ${mapping.contentId}`);
        console.log(`Status:        ${mapping.status}`);
        console.log(`Airtable ID:   ${mapping.point.recordId}`);
        console.log(`Airtable naam: ${mapping.point.name}`);
        console.log(`Review tabel:  ${mapping.review.table}`);
        console.log(`Waarde veld:   ${mapping.review.value.field}`);
        console.log(`Status veld:   ${mapping.review.status.field}`);
        console.log(`Foto veld:     ${mapping.review.photo.field}`);
        console.log(`Opmerking:     ${mapping.review.comment.field}`);

    }

    console.log("");
    console.log("===== RECORD MAPPING DRY-RUN GESLAAGD =====");
    console.log("");

}


run().catch(error => {

    console.error("");
    console.error("===== DRY-RUN MISLUKT =====");
    console.error("");
    console.error(error);
    process.exit(1);

});