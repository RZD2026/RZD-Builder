require("dotenv").config();

const axios = require("axios");

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};

const TABLE = "Accommodatie Beoordelingen";
const ACCOMMODATION_ID = "receCbuC0qSuQAZK0";

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
    console.log("===== TODAY TEST 42 =====");
    console.log("");

    const records =
        await getAllRecords();

    const matches =
        records
            .filter(record => {

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

            })
            .map(record => ({

                id: record.id,

                pointId:
                    linkedIds(
                        record.fields?.Beoordelingspunt
                    )[0] || null,

                name:
                    record.fields?.["Beoordeling naam"] || null,

                createdTime:
                    record.createdTime

            }));


    console.log(
        `AANTAL GEVONDEN: ${matches.length}`
    );

    console.log("");

    console.log(
        JSON.stringify(
            matches,
            null,
            2
        )
    );

    console.log("");
    console.log("===== KLAAR =====");
    console.log("");

}


run().catch(error => {

    console.error("");
    console.error("===== FOUT =====");
    console.error(
        error.response?.data ||
        error.message
    );
    process.exit(1);

});