const loader =
    require("../services/contentModuleLoader");

const pointMappings =
    require("../content/mapping/pointMappings");

const airtableMapping =
    require("../content/mapping/airtableMapping");

const airtableAdapter =
    require("../services/airtableAdapter");


async function run() {

    const execute =
        process.argv.includes("--execute");

    const accommodationId =
        process.argv
            .find(arg =>
                arg.startsWith("--accommodation=")
            )
            ?.split("=")[1];

    if (!accommodationId) {

        throw new Error(
            "Accommodatie ontbreekt. Gebruik --accommodation=RECORD_ID."
        );

    }

    console.log("");
    console.log("===== RZD 5.1 BULK RECORD WRITE =====");
    console.log("");

    console.log(
        execute
            ? "MODUS: EXECUTE"
            : "MODUS: DRY-RUN"
    );

    console.log(
        "Accommodatie:",
        accommodationId
    );

    console.log("");

    const module =
        await loader.load("toegang");

    const mappings =
        await airtableMapping.createMany(
            module.points,
            pointMappings
        );

    const writable =
        mappings.filter(
            mapping =>
                mapping.status !== "NO_MATCH"
        );

    console.log(
        `Aantal modulepunten: ${module.points.length}`
    );

    console.log(
        `Aantal schrijfbaar: ${writable.length}`
    );

    console.log(
        `Aantal NO_MATCH: ${
            mappings.length - writable.length
        }`
    );

    console.log("");

    for (const mapping of writable) {

        const fields = {

            [mapping.review.links.accommodation]:
                [accommodationId],

            [mapping.review.links.point]:
                [mapping.point.recordId],

            "Beoordeling naam":
                mapping.point.name

        };

        console.log("--------------------------------");

        console.log(
            "Content ID:",
            mapping.contentId
        );

        console.log(
            "Beoordelingspunt:",
            mapping.point.name
        );

        console.log(
            "Actie:",
            execute ? "CREATE" : "DRY-RUN"
        );

        console.log("Velden:");

        console.dir(
            fields,
            {
                depth: null
            }
        );

        if (!execute) {
            continue;
        }

        const created =
            await airtableAdapter.createRecord(
                mapping.review.table,
                fields
            );

        console.log(
            "Aangemaakt:",
            created.id
        );

    }

    console.log("");

    console.log(
        execute
            ? "===== BULK WRITE GESLAAGD ====="
            : "===== BULK WRITE DRY-RUN GESLAAGD ====="
    );

    console.log("");

}


run().catch(error => {

    console.error("");
    console.error("===== BULK WRITE MISLUKT =====");
    console.error("");

    console.error(error);

    process.exit(1);

});