require("dotenv").config();

const axios = require("axios");

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};

const TABLE = "Accommodatie Beoordelingen";
const ACCOMMODATION_ID = "receCbuC0qSuQAZK0";

// Onze tests vandaag begonnen rond 13:32.
// We bekijken uitsluitend TEST 42-records van vandaag.
const START = new Date("2026-08-10T13:30:00.000Z");
const END = new Date("2026-08-10T15:00:00.000Z");


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

        offset =
            response.data.offset || null;

    } while (offset);

    return records;
}


function linkedIds(value) {

    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map(item => {

            if (typeof item === "string") {
                return item;
            }

            return item?.id || null;

        })
        .filter(Boolean);
}


async function run() {

    console.log("");
    console.log(
        "===== RZD 5.1 TODAY TEST 42 INSPECT ====="
    );
    console.log("");

    const records =
        await getAllRecords();

    const matches =
        records.filter(record => {

            const accommodationIds =
                linkedIds(
                    record.fields?.Accommodatie
                );

            const name =
                record.fields?.["Beoordeling naam"] || "";

            const created =
                new Date(record.createdTime);

            return (
                accommodationIds.includes(
                    ACCOMMODATION_ID
                ) &&
                name.includes("TEST 42") &&
                created >= START &&
                created <= END
            );

        });

    console.log(
        "Aantal gevonden:",
        matches.length
    );

    console.log("");

    for (const record of matches) {

        const pointIds =
            linkedIds(
                record.fields?.Beoordelingspunt
            );

        console.log("--------------------------------");

        console.log(
            "Record ID:",
            record.id
        );

        console.log(
            "Beoordelingspunt ID:",
            pointIds[0] || "-"
        );

        console.log(
            "Naam:",
            record.fields?.["Beoordeling naam"] || "-"
        );

        console.log(
            "Aangemaakt:",
            record.createdTime
        );

    }

    console.log("");
    console.log(
        "===== INSPECT GESLAAGD ====="
    );
    console.log("");
}


run().catch(error => {

    console.error("");
    console.error(
        "===== INSPECT MISLUKT ====="
    );
    console.error("");

    console.error(
        error.response?.data ||
        error.message
    );

    process.exit(1);

});