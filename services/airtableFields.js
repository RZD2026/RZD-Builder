
require("dotenv").config();

const axios = require("axios");

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
};

async function getTable(tableName = "Accommodaties") {

    const response = await axios.get(
        `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
        { headers }
    );

    const table = response.data.tables.find(
        table => table.name === tableName
    );

    if (!table) {
        throw new Error(`Tabel '${tableName}' niet gevonden.`);
    }

    return table;

}

async function getFieldNames(tableName = "Accommodaties") {

    const table = await getTable(tableName);

    return table.fields.map(field => field.name);

}

module.exports = {
    getTable,
    getFieldNames
};