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
    console.log(
        "===== RZD 5.1 SAFE RECORD WRITE ====="
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


    console.log(
        `Aantal modulepunten: ${module.points.length}`
    );

    console.log(
        `Aantal mappingresultaten: ${mappings.length}`
    );

    console.log(
        `Aantal NO_MATCH: ${mappings.filter(mapping => mapping.status === "NO_MATCH").length}`
    );

    console.log("");


    let creates = 0;
    let updates = 0;
    let duplicates = 0;
    let skippedNoMatch = 0;
    let blockedMappings = 0;
    let blockedPreflight = 0;


    for (const mapping of mappings) {

        const pointId =
            mapping.point.recordId;

        const pointName =
            mapping.point.name;


        const fields = {

            [mapping.review.links.accommodation]:
                [accommodationId],

            [mapping.review.links.point]:
                [pointId],

            "Beoordeling naam":
                pointName

        };


        console.log("--------------------------------");

        console.log(
            "Content ID:",
            mapping.contentId
        );

        console.log(
            "Mappingstatus:",
            mapping.status ?? "(ontbreekt)"
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

        const upsert = await reviewWriteService.upsertMappedReview({
            accommodationId: accommodationId,
            pointId: pointId,
            fields: fields,
            mapping: mapping,
            dryRun: !execute
        });

        if (upsert.action === "CREATE") {
            creates++;
        } else if (upsert.action === "UPDATE") {
            updates++;
        } else if (upsert.action === "BLOCKED_MULTIPLE_MATCHES") {
            duplicates++;
        } else if (upsert.action === "SKIPPED_NO_MATCH") {
            skippedNoMatch++;
        } else if (upsert.action === "BLOCKED_MAPPING_STATUS") {
            blockedMappings++;
        } else if (upsert.action === "BLOCKED_INVALID_MAPPED_REVIEW") {
            blockedPreflight++;
        }

        console.log(
            "Resultaat:",
            upsert.action,
            upsert.recordId ? `(${upsert.recordId})` : ""
        );

        if (upsert.fieldErrors?.length > 0) {
            console.error("Preflight-fouten:", upsert.fieldErrors.join("; "));
        }

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
        "NO_MATCH overgeslagen:",
        skippedNoMatch
    );

    console.log(
        "Mapping geblokkeerd:",
        blockedMappings
    );+
    console.log(
        "Preflight geblokkeerd:",
        blockedPreflight
    );

    console.log("");


    if (execute) {

        console.log(
            "===== SAFE WRITE GESLAAGD ====="
        );

    } else {

        console.log(
            "===== SAFE WRITE DRY-RUN GESLAAGD ====="
        );

    }

    console.log("");

}


run().catch(error => {

    console.error("");
    console.error(
        "===== SAFE WRITE MISLUKT ====="
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