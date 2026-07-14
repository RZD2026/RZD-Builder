
require("dotenv").config();

const axios = require("axios");

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_TOKEN;

async function readSchema() {

    try {

        console.log("📖 Schema ophalen...");

        const response = await axios.get(
            `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        const tables = response.data.tables;

        console.log("");
        console.log("======================================");
        console.log(" RZD Builder - Schema");
        console.log("======================================");

        tables.forEach(table => {

            console.log("");
            console.log(`📂 ${table.name}`);
            console.log(`🆔 ${table.id}`);

            table.fields.forEach(field => {
                console.log(`   └─ ${field.name} (${field.type})`);
            });

        });

        console.log("");
        console.log(`✅ ${tables.length} tabel(len) gevonden.`);

        return tables;

    } catch (err) {

        console.error("");
        console.error("❌ Schema kon niet worden gelezen.");

        if (err.response) {
            console.error(err.response.data);
        } else {
            console.error(err.message);
        }

        return null;

    }

}

module.exports = {
    readSchema
};