
require("dotenv").config();

const axios = require("axios");

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
};

class AirtableAdapter {

    async getTables() {

        const response = await axios.get(
            `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
            { headers }
        );

        return response.data.tables;

    }

    async getTable(tableName) {

        const tables = await this.getTables();

        return tables.find(table => table.name === tableName);

    }

    async getFieldNames(tableName) {

        const table = await this.getTable(tableName);

        if (!table) {
            throw new Error(`Tabel '${tableName}' niet gevonden.`);
        }

        return table.fields.map(field => field.name);

    }

}

module.exports = new AirtableAdapter();