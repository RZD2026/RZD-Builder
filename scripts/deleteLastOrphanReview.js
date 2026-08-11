require("dotenv").config();

const axios = require("axios");

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const TABLE = "Accommodatie beoordelingen";
const RECORD_ID = "reczdinSF0etKAFYY";

const headers = {
    Authorization: `Bearer ${token}`
};

async function run() {

    console.log("");
    console.log("===== RZD 5.1 DELETE ORPHAN REVIEW =====");
    console.log("");
    console.log("Record:", RECORD_ID);
    console.log("Tabel:", TABLE);
    console.log("Actie: DELETE");
    console.log("");

    await axios.delete(
        `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE)}/${RECORD_ID}`,
        { headers }
    );

    console.log("===== DELETE GESLAAGD =====");
    console.log("Verwijderd:", RECORD_ID);
    console.log("");
}

run().catch(error => {

    console.error("");
    console.error("===== DELETE MISLUKT =====");
    console.error("");

    console.error(
        error.response?.data ||
        error.message
    );

    process.exit(1);
});