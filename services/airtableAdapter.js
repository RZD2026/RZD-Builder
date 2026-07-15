
require("dotenv").config();

const axios = require("axios");
const FieldOptionsFactory = require("./fieldOptionsFactory");

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

        const table = tables.find(t => t.name === tableName);

        if (!table) {
            throw new Error(`Tabel '${tableName}' niet gevonden.`);
        }

        return table;

    }

    async getTableId(tableName) {

        const table = await this.getTable(tableName);

        return table.id;

    }

    async getFieldNames(tableName) {

        const table = await this.getTable(tableName);

        return table.fields.map(field => field.name);

    }

    async createField(tableName, field) {

        const tableId = await this.getTableId(tableName);

        const payload = {
            name: field.name,
            type: field.type
        };

        const options = FieldOptionsFactory.get(field.type);

        if (options) {
            payload.options = options;
        }

        console.log(`➕ ${field.name}`);

        try {

            const response = await axios.post(
                `https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}/fields`,
                payload,
                { headers }
            );

            console.log(`✅ ${field.name}`);

            return response.data;

        } catch (error) {

            if (error.response) {

                console.log("");
                console.log("========== AIRTABLE ERROR ==========");
                console.dir(error.response.data, { depth: null });
                console.log("====================================");
                console.log("");

            }

            throw error;

        }

    }

    async createMissingFields(tableName, fields) {

        const existingFields = await this.getFieldNames(tableName);

        let created = 0;
        let skipped = 0;

        for (const field of fields) {

            if (existingFields.includes(field.name)) {

                console.log(`✓ ${field.name}`);
                skipped++;
                continue;

            }

            await this.createField(tableName, field);
            created++;

        }

        console.log("");
        console.log("================================");
        console.log("Resultaat");
        console.log("================================");
        console.log(`Aangemaakt : ${created}`);
        console.log(`Overgeslagen : ${skipped}`);
        console.log("");

        return {
            created,
            skipped
        };

    }

}

module.exports = new AirtableAdapter();