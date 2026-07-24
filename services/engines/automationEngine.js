
'use strict';

const axios = require('axios');

class AutomationEngine {

    constructor() {
        this.webhookUrl = process.env.AIRTABLE_AUTOMATION_WEBHOOK;
    }

    async execute(update) {

        if (!this.webhookUrl) {
            throw new Error(
                'AIRTABLE_AUTOMATION_WEBHOOK is niet ingesteld.'
            );
        }

        if (!update) {
            return;
        }

        const payload = {
            tableId: update.tableId,
            fieldId: update.fieldId,
            value: update.value
        };

        const response = await axios.post(
            this.webhookUrl,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        return response.data;
    }

}

module.exports = new AutomationEngine();