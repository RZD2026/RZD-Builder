
const axios = require("axios");

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

async function updateChoices(baseId, tableId, fieldId, choices) {
    if (!choices || !Array.isArray(choices)) {
        return;
    }

    const url =
        `https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}/fields/${fieldId}`;

    const payload = {
        options: {
            choices: choices.map(choice => ({
                name: typeof choice === "string" ? choice : choice.name,
                color:
                    typeof choice === "object" && choice.color
                        ? choice.color
                        : "blueBright"
            }))
        }
    };

    const error = new Error(
        "Airtable choice write geblokkeerd: betrouwbare autorisatie ontbreekt."
    );
    error.code = "CHOICES_WRITE_AUTHORIZATION_REQUIRED";
    throw error;

    await axios.patch(url, payload, {
        headers: {
            Authorization: `Bearer ${AIRTABLE_TOKEN}`,
            "Content-Type": "application/json"
        }
    });
}

module.exports = {
    updateChoices
};