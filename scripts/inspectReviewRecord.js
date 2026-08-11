require("dotenv").config();

const axios = require("axios");

const baseId =
    process.env.AIRTABLE_BASE_ID;

const token =
    process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};


async function run() {

    console.log("");
    console.log("===== RZD 5.1 REVIEW RECORD INSPECT =====");
    console.log("");

    const table =
        encodeURIComponent(
            "Accommodatie Beoordelingen"
        );

    let offset = null;
    const records = [];

    do {

        const params = {
            pageSize: 100
        };

        if (offset) {
            params.offset = offset;
        }

        const response =
            await axios.get(
                `https://api.airtable.com/v0/${baseId}/${table}`,
                {
                    headers,
                    params
                }
            );

        records.push(
            ...response.data.records
        );

        offset =
            response.data.offset || null;

    } while (offset);


    console.log(
        `AANTAL RECORDS VIA API: ${records.length}`
    );

    for (const record of records) {

        console.log("--------------------------------");
        console.log("Record ID:", record.id);

        console.dir(
            record.fields,
            {
                depth: null
            }
        );

    }

    console.log("");
    console.log("===== INSPECT GESLAAGD =====");
    console.log("");

}


run().catch(error => {

    console.error("");
    console.error("===== INSPECT MISLUKT =====");
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