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


const TEST_RECORD_IDS = [
    "rec908Val3rpB3nu3",
    "recNZ9dwG9zA1Gvp5",
    "recSBVtwx2oCIXB5X",
    "recg9F3wTNCIZV2bd",
    "recgg8gsk4LWpQrBm",
    "recrW9z76PBcUIfjC",
    "recvweayDYVYFFOx8",
    "recx2QRxTKGtwlVq2"
];


async function getRecord(recordId) {

    const response =
        await axios.get(
            `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE)}/${recordId}`,
            {
                headers
            }
        );

    return response.data;
}


async function run() {

    console.log("");
    console.log(
        "===== RZD 5.1 TEST 42 CLEANUP DRY-RUN ====="
    );
    console.log("");

    console.log(
        "Aantal geselecteerde records:",
        TEST_RECORD_IDS.length
    );

    console.log("");

    for (const recordId of TEST_RECORD_IDS) {

        const record =
            await getRecord(recordId);

        console.log("--------------------------------");

        console.log(
            "Record ID:",
            record.id
        );

        console.log(
            "Beoordelingspunt:",
            record.fields?.["Beoordeling naam"] ||
            "-"
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
        TEST_RECORD_IDS.length
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