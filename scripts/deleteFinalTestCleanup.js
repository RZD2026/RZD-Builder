require("dotenv").config();

const axios = require("axios");

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};

const TABLES = [
    "Accommodaties",
    "Accommodatie beoordelingen",
    "Opmerkingen",
    "Verbeterpunten"
];

const TEST_ACCOMMODATION_IDS = [
    "receCbuC0qSuQAZK0",
    "recu7druA9BMOZhDk"
];

const KARIOS_ID = "recQzECjVOUbQjc5g";


async function getAllRecords(tableName) {

    const records = [];
    let offset = null;

    do {

        const params = {
            pageSize: 100
        };

        if (offset) {
            params.offset = offset;
        }

        const response = await axios.get(
            `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
            {
                headers,
                params
            }
        );

        records.push(...(response.data.records || []));
        offset = response.data.offset || null;

    } while (offset);

    return records;
}


function linkedIds(value) {

    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map(item =>
            typeof item === "string"
                ? item
                : item?.id || null
        )
        .filter(Boolean);
}


async function deleteRecord(tableName, recordId) {

    await axios.delete(
        `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`,
        {
            headers
        }
    );
}


async function run() {

    console.log("");
    console.log(
        "===== RZD 5.1 FINAL TEST CLEANUP ====="
    );
    console.log("");

    const accommodations =
        await getAllRecords("Accommodaties");

    const reviews =
        await getAllRecords("Accommodatie beoordelingen");

    const notes =
        await getAllRecords("Opmerkingen");

    const improvements =
        await getAllRecords("Verbeterpunten");


    const targets = [];


    // TEST-accommodaties
    for (const record of accommodations) {

        if (
            TEST_ACCOMMODATION_IDS.includes(record.id)
        ) {

            targets.push({
                table: "Accommodaties",
                id: record.id,
                reason: "TEST-accommodatie"
            });

        }

    }


    // Reviews gekoppeld aan TEST-accommodaties
    for (const record of reviews) {

        const accommodationIds =
            linkedIds(
                record.fields?.Accommodatie
            );

        if (
            accommodationIds.some(
                id =>
                    TEST_ACCOMMODATION_IDS.includes(id)
            )
        ) {

            targets.push({
                table: "Accommodatie beoordelingen",
                id: record.id,
                reason: "gekoppeld aan TEST-accommodatie"
            });

        }

    }


    // Karios: alleen expliciete workflow-testrecords
    for (const record of reviews) {

        const accommodationIds =
            linkedIds(
                record.fields?.Accommodatie
            );

        const name =
            record.fields?.["Beoordeling naam"] || "";

        const comment =
            record.fields?.["Opmerking"] || "";

        if (
            accommodationIds.includes(KARIOS_ID) &&
            (
                comment.includes(
                    "Voorbeeldtest RZD 5.1"
                ) ||
                name.includes(
                    "Voorbeeldtest RZD 5.1"
                )
            )
        ) {

            targets.push({
                table: "Accommodatie beoordelingen",
                id: record.id,
                reason: "Karios workflowtest"
            });

        }

    }


    // TEST-records in Opmerkingen
    for (const record of notes) {

        const text =
            JSON.stringify(
                record.fields || {}
            );

        if (/TEST\s*\d+/i.test(text)) {

            targets.push({
                table: "Opmerkingen",
                id: record.id,
                reason: "expliciete TEST-data"
            });

        }

    }


    // TEST-records in Verbeterpunten
    for (const record of improvements) {

        const text =
            JSON.stringify(
                record.fields || {}
            );

        if (/TEST\s*\d+/i.test(text)) {

            targets.push({
                table: "Verbeterpunten",
                id: record.id,
                reason: "expliciete TEST-data"
            });

        }

    }


    // Dubbelen verwijderen
    const uniqueTargets =
        Array.from(
            new Map(
                targets.map(
                    target => [
                        `${target.table}:${target.id}`,
                        target
                    ]
                )
            ).values()
        );


    console.log(
        "Gecontroleerde cleanup-doelset:",
        uniqueTargets.length
    );

    console.log("");


    if (uniqueTargets.length !== 21) {

        throw new Error(
            `VEILIGHEIDSSTOP: verwacht 21 records, maar vond ${uniqueTargets.length}. Er wordt niets verwijderd.`
        );

    }


    for (const target of uniqueTargets) {

        console.log(
            "Verwijder:",
            target.table,
            "|",
            target.id,
            "|",
            target.reason
        );

        await deleteRecord(
            target.table,
            target.id
        );

        console.log(
            "  ✓ verwijderd"
        );

    }


    console.log("");
    console.log(
        "===== CLEANUP GESLAAGD ====="
    );

    console.log(
        "Verwijderd:",
        uniqueTargets.length
    );

    console.log("");

}


run().catch(error => {

    console.error("");
    console.error(
        "===== CLEANUP MISLUKT / VEILIGHEIDSSTOP ====="
    );
    console.error("");

    console.error(
        error.response?.data ||
        error.message
    );

    process.exit(1);

});