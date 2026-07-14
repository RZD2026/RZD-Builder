require("dotenv").config();

const Airtable = require("airtable");

const base = new Airtable({
    apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID);

async function testConnection() {
    try {
        console.log("🔄 Verbinding met Airtable controleren...");

        await base("Accommodaties")
            .select({ maxRecords: 1 })
            .firstPage();

        console.log("✅ Verbinding geslaagd!");
        return true;

    } catch (error) {
        console.error("❌ Verbinding mislukt.");
        console.error(error.message);
        return false;
    }
}

module.exports = {
    base,
    testConnection
};
