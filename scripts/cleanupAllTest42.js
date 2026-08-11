require("dotenv").config();

const axios = require("axios");

const baseId =
    process.env.AIRTABLE_BASE_ID;

const token =
    process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};

const TABLE =
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
        .map(item =>
            typeof item === "string"
                ? item
                : item?.id || null
        )
        .filter(Boolean);

}


async function run() {

    console.log("");
    console.log(
        "===== RZD 5.1 ALL TEST 42 CLEANUP DRY-RUN ====="
    );
    console.log("");

    const records =
        await getAllRecords();

    const testRecords =
        records.filter(record => {

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
        "Aantal TEST 42-records:",
        testRecords.length
    );

    console.log("");


    for (const record of testRecords) {

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
            "Beoordeling naam:",
            record.fields?.["Beoordeling naam"] ||
            "-"
        );

        console.log(
            "Aangemaakt:",
            record.createdTime
        );

        console.log(
            "Actie: DELETE"
        );

    }


    console.log("");
    console.log(
        "===== SAMENVATTING ====="
    );

    console.log(
        "Te verwijderen:",
        testRecords.length
    );

    console.log("");

    console.log(
        "LET OP: er is niets verwijderd."
    );

    console.log("");

    console.log(
        "===== CLEANUP DRY-RUN GESLAAGD ====="
    );

    console.log("");

}


run().catch(error => {

    console.error("");
    console.error(
        "===== CLEANUP DRY-RUN MISLUKT ====="
    );
    console.error("");

    console.error(
        error.response?.data ||
        error.message
    );

    process.exit(1);

});