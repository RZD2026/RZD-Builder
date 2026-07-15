
require("dotenv").config();

const axios = require("axios");

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
};

(async () => {

    try {

        const response = await axios.get(
            `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
            { headers }
        );

        console.log("");
        console.log("================================");
        console.log("RZD Metadata Inspector");
        console.log("================================");
        console.log("");

        console.dir(response.data, { depth: null });

        console.log("");
        console.log("================================");
        console.log("Einde metadata");
        console.log("================================");
        console.log("");

    } catch (error) {

        console.log("");
        console.log("========== AIRTABLE ERROR ==========");

        if (error.response) {
            console.dir(error.response.data, { depth: null });
        } else {
            console.log(error.message);
        }

        console.log("====================================");
        console.log("");

    }

})();