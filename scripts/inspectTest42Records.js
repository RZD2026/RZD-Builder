require("dotenv").config();

const axios = require("axios");

const baseId =
    process.env.AIRTABLE_BASE_ID;

const token =
    process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};

const REVIEW_TABLE =
    "Accommodatie Beoordelingen";

const ACCOMMODATION_ID =
    "receCbuC0qSuQAZK0";


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


function getLinkedIds(value) {

    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map(item => {

            if (typeof item === "string") {
                return item;
            }

            if (
                item &&
                typeof item === "object"
            ) {
                return item.id || null;
            }

            return null;

        })
        .filter(Boolean);

}


async function run() {

    console.log("");
    console.log(
        "===== RZD 5.1 TEST 42 RECORD INSPECT ====="
    );
    console.log("");

    const records =
        await getAllRecords();

    const testRecords =
        records.filter(record => {

            const accommodationIds =
                getLinkedIds(
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
        "Aantal TEST 42-records:",
        testRecords.length
    );

    console.log("");

    for (const record of testRecords) {

        const pointIds =
            getLinkedIds(
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
            "Beoordeling naam:",
            record.fields?.["Beoordeling naam"] ||
                "-"
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