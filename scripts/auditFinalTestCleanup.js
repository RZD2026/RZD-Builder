require("dotenv").config();

const axios = require("axios");

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};

const ACCOMMODATION_TABLE = "Accommodaties";
const REVIEW_TABLE = "Accommodatie beoordelingen";
const NOTES_TABLE = "Opmerkingen";
const IMPROVEMENTS_TABLE = "Verbeterpunten";

const TEST_ACCOMMODATION_IDS = [
    "receCbuC0qSuQAZK0",
    "recu7druA9BMOZhDk"
];

const KARIOS_ID = "recQzECjVOUbQjc5g";


async function getAllRecords(tableName) {

    const records = [];
    let offset = null;

    do {

        const params = { pageSize: 100 };

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


function addCandidate(list, table, record, reason) {

    list.push({
        table,
        id: record.id,
        name:
            record.fields?.["Beoordeling naam"] ||
            record.fields?.["Onderwerp"] ||
            record.fields?.["Verbeterpunt"] ||
            record.fields?.["Naam"] ||
            record.fields?.["Naam accommodatie"] ||
            "-",
        created: record.createdTime,
        reason
    });

}


async function run() {

    console.log("");
    console.log(
        "===== RZD 5.1 FINAL TEST CLEANUP AUDIT ====="
    );
    console.log("");

    const accommodations =
        await getAllRecords(ACCOMMODATION_TABLE);

    const reviews =
        await getAllRecords(REVIEW_TABLE);

    const notes =
        await getAllRecords(NOTES_TABLE);

    const improvements =
        await getAllRecords(IMPROVEMENTS_TABLE);


    const candidates = [];


    // 1. Testaccommodaties zelf
    for (const record of accommodations) {

        if (
            TEST_ACCOMMODATION_IDS.includes(record.id)
        ) {

            addCandidate(
                candidates,
                ACCOMMODATION_TABLE,
                record,
                "TEST-accommodatie"
            );

        }

    }


    // 2. Alle reviews gekoppeld aan testaccommodaties
    for (const record of reviews) {

        const accommodationIds =
            linkedIds(
                record.fields?.Accommodatie
            );

        const linkedToTest =
            accommodationIds.some(
                id =>
                    TEST_ACCOMMODATION_IDS.includes(id)
            );

        if (linkedToTest) {

            addCandidate(
                candidates,
                REVIEW_TABLE,
                record,
                "gekoppeld aan TEST-accommodatie"
            );

        }

    }


    // 3. Karios: alleen expliciete workflow-testrecords
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

            addCandidate(
                candidates,
                REVIEW_TABLE,
                record,
                "Karios workflowtest: Voorbeeldtest RZD 5.1"
            );

        }

    }


    // 4. TEST-records in Opmerkingen
    for (const record of notes) {

        const text =
            JSON.stringify(
                record.fields || {}
            );

        if (/TEST\s*\d+/i.test(text)) {

            addCandidate(
                candidates,
                NOTES_TABLE,
                record,
                "expliciete TEST-data"
            );

        }

    }


    // 5. TEST-records in Verbeterpunten
    for (const record of improvements) {

        const text =
            JSON.stringify(
                record.fields || {}
            );

        if (/TEST\s*\d+/i.test(text)) {

            addCandidate(
                candidates,
                IMPROVEMENTS_TABLE,
                record,
                "expliciete TEST-data"
            );

        }

    }


    // Dubbele kandidaten verwijderen
    const unique =
        Array.from(
            new Map(
                candidates.map(
                    item =>
                        [
                            `${item.table}:${item.id}`,
                            item
                        ]
                )
            ).values()
        );


    console.log(
        "===== DEFINITIEVE CLEANUP-DOELSET ====="
    );

    console.log("");

    for (const item of unique) {

        console.log("--------------------------------");

        console.log(
            "Tabel:",
            item.table
        );

        console.log(
            "Record ID:",
            item.id
        );

        console.log(
            "Naam:",
            item.name
        );

        console.log(
            "Aangemaakt:",
            item.created
        );

        console.log(
            "Reden:",
            item.reason
        );

    }


    console.log("");
    console.log("===== SAMENVATTING =====");

    console.log(
        "Totaal te verwijderen:",
        unique.length
    );

    console.log("");

    console.log(
        "Beoordelingspunten: NIET geraakt"
    );

    console.log(
        "Modules: NIET geraakt"
    );

    console.log(
        "Standaard beoordelingssets: NIET geraakt"
    );

    console.log(
        "Karios accommodatie: NIET geraakt"
    );

    console.log("");

    console.log(
        "LET OP: er is niets gewijzigd."
    );

    console.log(
        "Dit is uitsluitend een read-only dry-run."
    );

    console.log("");

    console.log(
        "===== AUDIT GESLAAGD ====="
    );

}


run().catch(error => {

    console.error("");
    console.error(
        "===== AUDIT MISLUKT ====="
    );
    console.error("");

    console.error(
        error.response?.data ||
        error.message
    );

    process.exit(1);

});