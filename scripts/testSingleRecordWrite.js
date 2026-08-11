const loader =
    require("../services/contentModuleLoader");

const pointMappings =
    require("../content/mapping/pointMappings");

const airtableMapping =
    require("../content/mapping/airtableMapping");

const airtableAdapter =
    require("../services/airtableAdapter");


async function run() {

    console.log("");
    console.log("===== RZD 5.1 SINGLE RECORD WRITE =====");
    console.log("");

    const module =
        await loader.load("toegang");

    const point =
        module.points.find(
            item =>
                item.id === "entrance_turning_circle"
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

    const accommodationRecordId =
        "receCbuC0qSuQAZK0";

    const fields = {

        [mapping.review.links.accommodation]:
            [accommodationRecordId],

        [mapping.review.links.point]:
            [mapping.point.recordId],

        "Beoordeling naam":
            `TEST 42 - ${mapping.point.name}`

    };

    console.log(
        "Content ID:",
        mapping.contentId
    );

    console.log(
        "Status:",
        mapping.status
    );

    console.log(
        "Beoordelingspunt:",
        mapping.point.name
    );

    console.log(
        "Beoordelingspunt ID:",
        mapping.point.recordId
    );

    console.log(
        "Accommodatie ID:",
        accommodationRecordId
    );

    console.log(
        "Tabel:",
        mapping.review.table
    );

    console.log("Velden:");

    console.dir(
        fields,
        {
            depth: null
        }
    );

    console.log("");
    console.log("Schrijf record naar Airtable...");

    const created =
        await airtableAdapter.createRecord(
            mapping.review.table,
            fields
        );

    console.log("");
    console.log("===== WRITE GESLAAGD =====");

    console.log(
        "Nieuw record ID:",
        created.id
    );

    console.log("");

}


run().catch(error => {

    console.error("");
    console.error("===== WRITE MISLUKT =====");
    console.error("");

    console.error(error);

    process.exit(1);

});