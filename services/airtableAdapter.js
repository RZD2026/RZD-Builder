require("dotenv").config();

const axios = require("axios");

const FieldOptionsFactory =
    require("./fieldOptionsFactory");

const baseId =
    process.env.AIRTABLE_BASE_ID;

const token =
    process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
};


class AirtableAdapter {


    getFieldName(field) {

        return (
            field?.labels?.airtable ??
            field?.name ??
            field?.id
        );

    }


    async getTables() {

        const response =
            await axios.get(
                `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
                { headers }
            );

        return response.data.tables;

    }


    async getTable(tableName) {

        const tables =
            await this.getTables();

        const table =
            tables.find(
                t => t.name === tableName
            );

        if (!table) {

            throw new Error(
                `Tabel '${tableName}' niet gevonden.`
            );

        }

        return table;

    }


    async getTableId(tableName) {

        const table =
            await this.getTable(
                tableName
            );

        return table.id;

    }


    async getFieldNames(tableName) {

        const table =
            await this.getTable(
                tableName
            );

        return table.fields.map(
            field => field.name
        );

    }


    async getFields(tableName) {

        const table =
            await this.getTable(
                tableName
            );

        return table.fields;

    }


    async listRecords(
        tableName,
        params = {}
    ) {

        if (!tableName) {

            throw new Error(
                "AirtableAdapter.listRecords: tabelnaam ontbreekt."
            );

        }

        const records = [];
        let offset = null;

        do {

            const query = Object.assign({}, params);

            if (offset) {
                query.offset = offset;
            }

            const response =
                await axios.get(
                    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
                    {
                        headers,
                        params: query
                    }
                );

            records.push(
                ...(response.data.records || [])
            );

            offset = response.data.offset || null;

        } while (offset);

        return records;

    }


    async createTable(table) {

        if (
            !table ||
            typeof table !== "object"
        ) {

            throw new Error(
                "AirtableAdapter.createTable: tabeldefinitie ontbreekt."
            );

        }

        if (!table.name) {

            throw new Error(
                "AirtableAdapter.createTable: tabelnaam ontbreekt."
            );

        }

        const payload = {
            name: table.name,
            fields: table.fields || []
        };

        console.log("");
        console.log(
            "========== CREATE TABLE =========="
        );
        console.log(
            `Tabel: ${table.name}`
        );
        console.dir(
            payload,
            { depth: null }
        );
        console.log(
            "=================================="
        );
        console.log("");

        const response =
            await axios.post(
                `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
                payload,
                { headers }
            );

        return response.data;

    }


    async createField(
        tableName,
        field
    ) {

        const tableId =
            await this.getTableId(
                tableName
            );

        const fieldName =
            this.getFieldName(
                field
            );

        const payload = {
            name: fieldName,
            type: field.type
        };

        if (
            field.description?.trim()
        ) {

            payload.description =
                field.description;

        }

        const options =
            FieldOptionsFactory.get(
                field
            );

        if (
            options &&
            Object.keys(options).length > 0
        ) {

            payload.options =
                options;

        }

        console.log(
            `➕ ${fieldName}`
        );

        try {

            const response =
                await axios.post(
                    `https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}/fields`,
                    payload,
                    { headers }
                );

            console.log(
                `✓ ${fieldName}`
            );

            return response.data;

        } catch (error) {

            if (error.response) {

                console.log("");
                console.log(
                    "========== AIRTABLE ERROR =========="
                );

                console.dir(
                    error.response.data,
                    { depth: null }
                );

                console.log(
                    "===================================="
                );

                console.log("");

            }

            throw error;

        }

    }


    async createMissingFields(
        tableName,
        fields
    ) {

        const existingFields =
            await this.getFieldNames(
                tableName
            );

        let created = 0;
        let skipped = 0;

        for (const field of fields) {

            const fieldName =
                this.getFieldName(
                    field
                );

            if (
                existingFields.includes(
                    fieldName
                )
            ) {

                console.log(
                    `✓ ${fieldName}`
                );

                skipped++;

                continue;

            }

            await this.createField(
                tableName,
                field
            );

            created++;

        }

        console.log("");
        console.log(
            "================================"
        );
        console.log(
            "Resultaat"
        );
        console.log(
            "================================"
        );
        console.log(
            `Aangemaakt  : ${created}`
        );
        console.log(
            `Overgeslagen: ${skipped}`
        );
        console.log("");

        return {
            created,
            skipped
        };

    }


    async createRecord(
        tableName,
        fields
    ) {

        if (!tableName) {

            throw new Error(
                "AirtableAdapter.createRecord: tabelnaam ontbreekt."
            );

        }

        if (
            !fields ||
            typeof fields !== "object"
        ) {

            throw new Error(
                "AirtableAdapter.createRecord: fields ontbreken."
            );

        }

        const payload = {
            fields
        };

        const response =
            await axios.post(
                `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
                payload,
                { headers }
            );

        return response.data;

    }


    async getRecord(
        tableName,
        recordId
    ) {

        if (!tableName) {

            throw new Error(
                "AirtableAdapter.getRecord: tabelnaam ontbreekt."
            );

        }

        if (!recordId) {

            throw new Error(
                "AirtableAdapter.getRecord: recordId ontbreekt."
            );

        }

        const response =
            await axios.get(
                `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`,
                { headers }
            );

        return response.data;

    }


    async updateRecord(
        tableName,
        recordId,
        fields
    ) {

        if (!tableName) {

            throw new Error(
                "AirtableAdapter.updateRecord: tabelnaam ontbreekt."
            );

        }

        if (!recordId) {

            throw new Error(
                "AirtableAdapter.updateRecord: recordId ontbreekt."
            );

        }

        if (
            !fields ||
            typeof fields !== "object"
        ) {

            throw new Error(
                "AirtableAdapter.updateRecord: fields ontbreken."
            );

        }

        const payload = {
            fields
        };

        const response =
            await axios.patch(
                `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`,
                payload,
                { headers }
            );

        return response.data;

    }


    async deleteRecord(
        tableName,
        recordId
    ) {

        if (!tableName) {

            throw new Error(
                "AirtableAdapter.deleteRecord: tabelnaam ontbreekt."
            );

        }

        if (!recordId) {

            throw new Error(
                "AirtableAdapter.deleteRecord: recordId ontbreekt."
            );

        }

        const response =
            await axios.delete(
                `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`,
                { headers }
            );

        return response.data;

    }


}


module.exports =
    new AirtableAdapter();