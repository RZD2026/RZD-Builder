
require("dotenv").config();

const axios = require("axios");

async function testPermissions() {

    const baseId = process.env.AIRTABLE_BASE_ID;
    const token = process.env.AIRTABLE_TOKEN;

    console.log("");
    console.log("================================");
    console.log("Airtable Permission Test");
    console.log("================================");
    console.log("");

    try {

        const response = await axios.get(
            `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("✅ Metadata API bereikbaar");
        console.log(`✅ ${response.data.tables.length} tabel(len) gevonden`);
        console.log("");

        console.log("Als deze test slaagt, weten we dat:");
        console.log("✓ Token geldig");
        console.log("✓ Base bestaat");
        console.log("✓ Metadata leesrechten aanwezig");
        console.log("");

        console.log("De volgende stap wordt het testen van schrijfrechten.");

    } catch (error) {

        console.log("❌ Metadata API niet bereikbaar");
        console.log("");

        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

    }

}

module.exports = {
    testPermissions
};