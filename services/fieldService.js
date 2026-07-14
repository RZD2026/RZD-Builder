
require("dotenv").config();

const axios = require("axios");

async function getFields(tableName = "Accommodaties") {

    const baseId = process.env.AIRTABLE_BASE_ID;
    const token = process.env.AIRTABLE_TOKEN;

    const response = await axios.get(
        `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const table = response.data.tables.find(t => t.name === tableName);

    if (!table) {
        throw new Error(`Tabel '${tableName}' niet gevonden.`);
    }

    return table.fields.map(field => field.name);

}

module.exports = {
    getFields
};