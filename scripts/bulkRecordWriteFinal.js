require("dotenv").config();

const axios = require("axios");

const loader =
    require("../services/contentModuleLoader");

const pointMappings =
    require("../content/mapping/pointMappings");

const airtableMapping =
    require("../content/mapping/airtableMapping");

const baseId =
    process.env.AIRTABLE_BASE_ID;

const token =
    process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
};

const reviewWriteService =
    require("../services/reviewWriteService");



async function run() {

    const execute =
        process.argv.includes("--execute");

    const accommodationId =
        process.argv
            .find(
                arg =>
                    arg.startsWith(
                        "--accommodation="
                    )
            )
            ?.split("=")[1];

    if (!accommodationId) {

        throw new Error(
            "Accommodatie ontbreekt.\n" +
            "Gebruik:\n" +
            "node scripts\\bulkRecordWriteFinal.js --accommodation=RECORD_ID"
        );

    }

    console.log("");
    console.log(
        "===== RZD 5.1 FINAL BULK RECORD WRITE ====="
    );
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
                mapping.status === "EXACT"
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

    let creates = 0;
    let updates = 0;
    let duplicates = 0;

    for (const mapping of writable) {

        const pointId =
            mapping.point.recordId;

        const pointName =
            mapping.point.name;

        const fields = {

            Accommodatie:
                [accommodationId],

            Beoordelingspunt:
                [pointId],

            "Beoordeling naam":
                pointName

        };

        console.log(
            "--------------------------------"
        );

        console.log(
            "Content ID:",
            mapping.contentId
        );

        console.log(
            "Beoordelingspunt:",
            pointName
        );

        console.log(
            "Actie:",
            execute ? "EXECUTE" : "DRY-RUN"
        );

        console.dir(fields, { depth: null });

        const upsert = await reviewWriteService.upsertReview({
            accommodationId: accommodationId,
            pointId: pointId,
            fields: fields,
            dryRun: !execute
        });

        if (upsert.action === "CREATE") {
            creates++;
        } else if (upsert.action === "UPDATE") {
            updates++;
        } else if (upsert.action === "BLOCKED_MULTIPLE_MATCHES") {
            duplicates++;
        }

        console.log(
            "Resultaat:",
            upsert.action,
            upsert.recordId ? `(${upsert.recordId})` : ""
        );

    }

    console.log("");
    console.log(
        "===== SAMENVATTING ====="
    );

    console.log(
        "CREATE:",
        creates
    );

    console.log(
        "UPDATE:",
        updates
    );

    console.log(
        "DUBBEL:",
        duplicates
    );

    console.log(
        "NO_MATCH:",
        mappings.length - writable.length
    );

    console.log("");


    if (duplicates > 0) {

        console.log(
            "===== VEILIGHEIDSWAARSCHUWING ====="
        );

        console.log(
            "Er zijn dubbele beoordelingsrecords."
        );

        console.log(
            "Deze records zijn NIET gewijzigd."
        );

        console.log("");

    }


    if (execute) {

        console.log(
            "===== FINAL BULK WRITE GESLAAGD ====="
        );

    } else {

        console.log(
            "===== FINAL BULK WRITE DRY-RUN GESLAAGD ====="
        );

    }

    console.log("");

}


run().catch(error => {

    console.error("");
    console.error(
        "===== FINAL BULK WRITE MISLUKT ====="
    );
    console.error("");

    if (error.response) {

        console.error(
            error.response.data
        );

    } else {

        console.error(
            error.message
        );

    }

    process.exit(1);

});