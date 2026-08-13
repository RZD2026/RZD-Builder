const loader =
    require("../services/contentModuleLoader");

const pointMappings =
    require("../content/mapping/pointMappings");

const airtableMapping =
    require("../content/mapping/airtableMapping");

const airtableAdapter =
    require("../services/airtableAdapter");
const reviewWriteService =
    require("../services/reviewWriteService");


async function run() {

    console.log("");
    console.log("===== RZD 5.1 MAPPED RECORD WRITE =====");
    console.log("");

    const accommodationId =
        "recQzECjVOUbQjc5g";

    const accommodationName =
        "Karios Hotel - Peschiera del Garda";

    const module =
        await loader.load("toegang");

    const mappedPoints =
        module.points.filter(point => {

            const mapping =
                pointMappings[point.id];

            return (
                mapping &&
                mapping.status !== "NO_MATCH" &&
                point.id !== "entrance_turning_circle"
            );

        });

    console.log(
        "Aantal nieuwe records:",
        mappedPoints.length
    );

    console.log("");

    for (const point of mappedPoints) {

        const pointMapping =
            pointMappings[point.id];

        const mapping =
            await airtableMapping.create(
                point,
                pointMapping
            );

        const fields = {

            "Beoordeling naam":
                `${accommodationName} - ${mapping.point.name}`,

            "Accommodatie":
                [accommodationId],

            "Beoordelingspunt":
                [mapping.point.recordId],

            "Status":
                "Nog niet beoordeeld"

        };

        console.log("--------------------------------");
        console.log(
            "Content ID:",
            point.id
        );
        console.log(
            "Beoordelingspunt:",
            mapping.point.name
        );

        console.log("Schrijf record (via reviewWriteService)...");

        const upsert = await reviewWriteService.upsertReview({
            accommodationId: accommodationId,
            pointId: mapping.point.recordId,
            fields: fields,
            dryRun: !process.argv.includes("--execute")
        });

        console.log(
            "Resultaat:",
            upsert.action,
            upsert.recordId ? `(${upsert.recordId})` : ""
        );

    }

    console.log("");
    console.log("===== MAPPED WRITE GESLAAGD =====");
    console.log("");

}


run().catch(error => {

    console.error("");
    console.error("===== MAPPED WRITE MISLUKT =====");
    console.error("");
    console.error(error);
    process.exit(1);

});