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


async function run() {

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


    const testRecords =
        records.filter(record => {

            const accommodation =
                record.fields?.Accommodatie || [];

            const name =
                record.fields?.["Beoordeling naam"] || "";

            return (
                accommodation.includes(
                    ACCOMMODATION_ID
                ) &&
                name.includes("TEST 42")
            );

        });


    console.log("");
    console.log("===== TEST 42 IDS =====");
    console.log("");
    console.log(
        "Aantal:",
        testRecords.length
    );
    console.log("");

    for (const record of testRecords) {

        console.log(
            `${record.id} | ${
                record.fields?.["Beoordeling naam"] || "-"
            }`
        );

    }

    console.log("");
    console.log("===== KLAAR =====");
    console.log("");

}


run().catch(error => {

    console.error("");
    console.error("FOUT:");
    console.error(
        error.response?.data ||
        error.message
    );

    process.exit(1);

});