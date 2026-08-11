require("dotenv").config();

const axios = require("axios");

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};

const TABLE = "Accommodatie Beoordelingen";
const ACCOMMODATION_ID = "receCbuC0qSuQAZK0";


async function getAllRecords() {

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
            `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE)}`,
            {
                headers,
                params
            }
        );

        records.push(
            ...(response.data.records || [])
        );

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


async function deleteRecord(recordId) {

    await axios.delete(
        `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE)}/${recordId}`,
        {
            headers
        }
    );
}


async function run() {

    console.log("");
    console.log("===== RZD 5.1 DELETE ALL TEST 42 =====");
    console.log("");

    const records = await getAllRecords();

    const testRecords = records.filter(record => {

        const accommodationIds =
            linkedIds(
                record.fields?.Accommodatie
            );

        const name =
            record.fields?.["Beoordeling naam"] || "";

        return (
            accommodationIds.includes(
                ACCOMMODATION_ID
            ) &&
            name.includes("TEST 42")
        );

    });

    console.log(
        "TEST 42-records gevonden:",
        testRecords.length
    );

    console.log("");

    if (testRecords.length === 0) {

        console.log(
            "Geen TEST 42-records gevonden."
        );

        return;
    }

    for (const record of testRecords) {

        console.log(
            "Verwijder:",
            record.id,
            "|",
            record.fields?.["Beoordeling naam"] || "-"
        );

        await deleteRecord(record.id);

        console.log(
            "✓ Verwijderd:",
            record.id
        );

    }

    console.log("");
    console.log("===== CLEANUP GESLAAGD =====");
    console.log("");
    console.log(
        "Verwijderd:",
        testRecords.length
    );
    console.log("");

}


run().catch(error => {

    console.error("");
    console.error("===== CLEANUP MISLUKT =====");
    console.error("");

    console.error(
        error.response?.data ||
        error.message
    );

    process.exit(1);

});