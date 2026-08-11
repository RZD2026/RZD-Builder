const loader =
    require("../services/contentModuleLoader");

const airtableMapping =
    require("../content/mapping/airtableMapping");

const pointMappings =
    require("../content/mapping/pointMappings");

const resolver =
    require("../content/mapping/airtablePointResolver");

async function run() {

    console.log("");
    console.log("===== RZD 5.1 POINT MAPPING DRY-RUN =====");
    console.log("");

    const module =
        await loader.load("toegang");

    const mappings =
        await airtableMapping.createMany(
            module.points,
            pointMappings
        );

    console.log("AANTAL MAPPINGS:", mappings.length);
    console.log("AANTAL MODULE POINTS:", module.points.length);
    console.log("MODULE IDS:", module.points.map(point => point.id)

);

    for (const point of module.points) {

        const mapping =
            mappings.find(
                item => item.contentId === point.id
            );

        const pointMapping =
            pointMappings[point.id];

        const resolved =
            await resolver.resolve(pointMapping);

        console.log("--------------------------------");
        console.log(`Canon ID:       ${point.id}`);
        console.log(`Canon naam:     ${point.labels.website}`);
        console.log(`Type:           ${point.type}`);
        console.log(`Eenheid:        ${point.unit || "-"}`);
        console.log(`Status:         ${pointMapping.status}`);

        if (pointMapping.status === "NO_MATCH") {

            console.log("Airtable:       GEEN MATCH");
            continue;

        }

        console.log(
            `Airtable ID:    ${resolved.recordId}`
        );

        console.log(
            `Airtable naam:  ${resolved.name}`
        );

        console.log(
            `Resultaat:      ${mapping.review.value.field}`
        );

        console.log(
            `Status veld:    ${mapping.review.status.field}`
        );

        console.log(
            `Foto:           ${mapping.review.photo.field}`
        );

        console.log(
            `Opmerking:      ${mapping.review.comment.field}`
        );

    }

    console.log("");
    console.log("===== SAMENVATTING =====");

    const summary = {
        EXACT: 0,
        POSSIBLE: 0,
        NO_MATCH: 0
    };

    for (const point of module.points) {

        const status =
            pointMappings[point.id]?.status;

        if (
            Object.prototype.hasOwnProperty.call(
                summary,
                status
            )
        ) {
            summary[status]++;
        }

    }

    console.log(`EXACT:     ${summary.EXACT}`);
    console.log(`POSSIBLE:  ${summary.POSSIBLE}`);
    console.log(`NO_MATCH:  ${summary.NO_MATCH}`);

    console.log("");
    console.log("===== DRY-RUN GESLAAGD =====");
    console.log("");

}

run().catch(error => {

    console.error("");
    console.error("===== DRY-RUN MISLUKT =====");
    console.error("");
    console.error(error);
    process.exit(1);

});