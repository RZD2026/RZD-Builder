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


const REVIEW_TABLE =
    "Accommodatie Beoordelingen";


async function findExistingReviews(
    accommodationId,
    pointRecordId
) {

    const formula =
        `AND(` +
        `FIND("${accommodationId}", ARRAYJOIN({Accommodatie})),` +
        `FIND("${pointRecordId}", ARRAYJOIN({Beoordelingspunt}))` +
        `)`;

    const response =
        await axios.get(
            `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(REVIEW_TABLE)}`,
            {
                headers,
                params: {
                    filterByFormula: formula,
                    pageSize: 100
                }
            }
        );

    return response.data.records || [];

}


async function createRecord(fields) {

    const response =
        await axios.post(
            `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(REVIEW_TABLE)}`,
            {
                fields
            },
            {
                headers
            }
        );

    return response.data;

}


async function updateRecord(
    recordId,
    fields
) {

    const response =
        await axios.patch(
            `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(REVIEW_TABLE)}/${recordId}`,
            {
                fields
            },
            {
                headers
            }
        );

    return response.data;

}


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


    let creates = 0;
    let updates = 0;
    let duplicates = 0;


    for (const mapping of writable) {

        const pointId =
            mapping.point.recordId;

        const pointName =
            mapping.point.name;


        const fields = {

            "Accommodatie":
                [accommodationId],

            "Beoordelingspunt":
                [pointId],

            "Beoordeling naam":
                pointName

        };


        const existing =
            await findExistingReviews(
                accommodationId,
                pointId
            );


        console.log("--------------------------------");

        console.log(
            "Content ID:",
            mapping.contentId
        );

        console.log(
            "Beoordelingspunt:",
            pointName
        );

        console.log(
            "Bestaande records:",
            existing.length
        );


        if (existing.length === 0) {

            creates++;

            console.log(
                "Actie: CREATE"
            );

            console.log(
                "Velden:"
            );

            console.dir(
                fields,
                {
                    depth: null
                }
            );


            if (execute) {

                const created =
                    await createRecord(
                        fields
                    );

                console.log(
                    "Aangemaakt:",
                    created.id
                );

            }

            continue;
        }


        if (existing.length > 1) {

            duplicates++;

            console.log(
                "Actie: DUPLICATE - NIET SCHRIJVEN"
            );

            console.log(
                "Record IDs:",
                existing.map(
                    record => record.id
                )
            );

            continue;
        }


        const existingRecord =
            existing[0];

        updates++;


        console.log(
            "Actie: UPDATE"
        );

        console.log(
            "Bestaand record:",
            existingRecord.id
        );


        if (execute) {

            const updated =
                await updateRecord(
                    existingRecord.id,
                    {
                        "Beoordeling naam":
                            pointName
                    }
                );

            console.log(
                "Bijgewerkt:",
                updated.id
            );

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