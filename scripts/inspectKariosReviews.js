require("dotenv").config();

const axios = require("axios");

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};

const REVIEW_TABLE =
    "Accommodatie Beoordelingen";

const ACCOMMODATION_ID =
    "recQzECjVOUbQjc5g";


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


function getLinkedId(value) {

    if (!Array.isArray(value)) {
        return null;
    }

    const first = value[0];

    if (typeof first === "string") {
        return first;
    }

    if (
        first &&
        typeof first === "object"
    ) {
        return first.id || null;
    }

    return null;
}


async function run() {

    console.log("");
    console.log(
        "===== RZD 5.1 KARIOS REVIEW INSPECT ====="
    );
    console.log("");

    const records =
        await getAllRecords();


    const kariosRecords =
        records.filter(record =>
            getLinkedId(
                record.fields?.Accommodatie
            ) === ACCOMMODATION_ID
        );


    console.log(
        "Karios reviewrecords:",
        kariosRecords.length
    );

    console.log("");


    for (const record of kariosRecords) {

        console.log(
            "--------------------------------"
        );

        console.log(
            "Record ID:",
            record.id
        );

        console.log(
            "Beoordelingspunt ID:",
            getLinkedId(
                record.fields?.Beoordelingspunt
            ) || "-"
        );

        console.log(
            "Beoordeling naam:",
            record.fields?.[
                "Beoordeling naam"
            ] || "-"
        );

        console.log(
            "Waarde / Resultaat:",
            record.fields?.[
                "Waarde / Resultaat"
            ] ?? "-"
        );

        console.log(
            "Status:",
            record.fields?.Status ?? "-"
        );

        console.log(
            "Foto / Bewijs:",
            record.fields?.[
                "Foto / Bewijs"
            ] ?? "-"
        );

        console.log(
            "Opmerking:",
            record.fields?.Opmerking ?? "-"
        );

    }


    console.log("");
    console.log(
        "===== SAMENVATTING ====="
    );

    console.log(
        "Verwacht:",
        "7 records"
    );

    console.log(
        "Gevonden:",
        kariosRecords.length
    );

    console.log("");

    if (kariosRecords.length === 7) {

        console.log(
            "✓ Aantal records klopt."
        );

    } else {

        console.log(
            "⚠ Aantal records wijkt af."
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