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
    console.log("===== RZD 5.1 SINGLE RECORD WRITE =====");
    console.log("");

    const accommodationId =
        "recQzECjVOUbQjc5g";

    const accommodationName =
        "Karios Hotel - Peschiera del Garda";

    const module =
        await loader.load("toegang");

    const point =
        module.points.find(
            item => item.id === "entrance_turning_circle"
        );

    if (!point) {
        throw new Error(
            "Content point 'entrance_turning_circle' niet gevonden."
        );
    }

    const pointMapping =
        pointMappings[point.id];

    const mapping =
        await airtableMapping.create(
            point,
            pointMapping
        );

    if (mapping.status === "NO_MATCH") {
        throw new Error(
            "Geen Airtable match gevonden."
        );
    }

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

    console.log("Accommodatie:", accommodationName);
    console.log("Accommodatie ID:", accommodationId);
    console.log("Beoordelingspunt:", mapping.point.name);
    console.log("Beoordelingspunt ID:", mapping.point.recordId);

    console.log("");
    console.log("Velden:");
    console.dir(fields, {
        depth: null
    });

    console.log("");
    console.log("Schrijf record (via reviewWriteService, dry-run)...");

    const upsert = await reviewWriteService.upsertReview({
        accommodationId: accommodationId,
        pointId: mapping.point.recordId,
        fields: fields,
        dryRun: true
    });

    console.log("");
    console.log("===== WRITE (DRY-RUN) GEDRAAIWD =====");
    console.log("Resultaat:", upsert.action, upsert.recordId ? `(${upsert.recordId})` : "");
    console.log("");

}


run().catch(error => {

    console.error("");
    console.error("===== WRITE MISLUKT =====");
    console.error("");
    console.error(error);
    process.exit(1);

});