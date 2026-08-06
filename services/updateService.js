
const axios = require("axios");

require("dotenv").config();

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
};

class UpdateService {

    async updateField(tableId, fieldId, payload) {

        console.log("");
        console.log("================================");
        console.log("UPDATE FIELD");
        console.log("================================");
        console.log("");

        console.log(`Table : ${tableId}`);
        console.log(`Field : ${fieldId}`);
        console.log("");

        console.log("PATCH PAYLOAD");
        console.dir(payload, {
            depth: null
        });
        console.log("");

        try {

            const response = await axios.patch(
    `https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}/fields/${fieldId}`,
    payload,
    {
        headers
    }
);

            console.log("✓ Update uitgevoerd.");
            console.log("");

            return response.data;

        } catch (error) {

            console.log("");
            console.log("========== AIRTABLE ERROR ==========");
            console.log("");

            if (error.response) {

                console.log("Status");
                console.log("--------------------------------");
                console.log(error.response.status);
                console.log("");

                console.log("Headers");
                console.log("--------------------------------");
                console.dir(error.response.headers, {
                    depth: null
                });
                console.log("");

                console.log("Response");
                console.log("--------------------------------");
                console.dir(error.response.data, {
                    depth: null
                });
                console.log("");

                console.log("Request URL");
                console.log("--------------------------------");
                console.log(error.config?.url);
                console.log("");

                console.log("Request Body");
                console.log("--------------------------------");
                console.dir(error.config?.data, {
                    depth: null
                });
                console.log("");

            } else {

                console.log(error.message);

            }

            console.log("====================================");
            console.log("");

            throw error;

        }

    }

}

module.exports = new UpdateService();