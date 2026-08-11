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


async function getAllReviewRecords() {

    const records = [];
    let offset = null;

    do {

        const params = {
            pageSize: 100
        };

        if (offset) {
            params.offset = offset;
        }

        const response =
            await axios.get(
                `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(REVIEW_TABLE)}`,
                {
                    headers,
                    params
                }
            );

        records.push(
            ...(response.data.records || [])
        );

        offset =
            response.data.offset || null;

    } while (offset);

    return records;
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


function containsLinkedRecord(
    fieldValue,
    recordId
) {

    if (!Array.isArray(fieldValue)) {
        return false;
    }

    return fieldValue.some(
        value => {

            if (typeof value === "string") {
                return value === recordId;
            }

            if (
                value &&
                typeof value === "object"
            ) {
                return value.id === recordId;
            }

            return false;

        }
    );
}


function findMatchingRecords(
    records,
    accommodationId,
    pointId
) {

    return records.filter(
        record => {

            const accommodationField =
                record.fields?.Accommodatie;

            const pointField =
                record.fields?.Beoordelingspunt;

            return (
                containsLinkedRecord(
                    accommodationField,
                    accommodationId
                ) &&
                containsLinkedRecord(
                    pointField,
                    pointId
                )
            );

        }
    );
}


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


    console.log(
        "Bestaande reviewrecords ophalen..."
    );

    const existingRecords =
        await getAllReviewRecords();

    console.log(
        "Aantal records via API:",
        existingRecords.length
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

            Accommodatie:
                [accommodationId],

            Beoordelingspunt:
                [pointId],

            "Beoordeling naam":
                pointName

        };


        const matches =
            findMatchingRecords(
                existingRecords,
                accommodationId,
                pointId
            );


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
            "Bestaande matches:",
            matches.length
        );


        // 0 = CREATE
        if (matches.length === 0) {

            creates++;

            console.log(
                "Actie: CREATE"
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


        // >1 = VEILIGHEIDSSTOP
        if (matches.length > 1) {

            duplicates++;

            console.log(
                "Actie: DUBBEL - NIET SCHRIJVEN"
            );

            console.log(
                "Record IDs:",
                matches.map(
                    record => record.id
                )
            );

            continue;
        }


        // 1 = UPDATE
        const existing =
            matches[0];

        updates++;

        console.log(
            "Actie: UPDATE"
        );

        console.log(
            "Bestaand record:",
            existing.id
        );


        if (execute) {

            const updated =
                await updateRecord(
                    existing.id,
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