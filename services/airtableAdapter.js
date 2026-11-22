require("dotenv").config();

const axios = require("axios");

const FieldOptionsFactory =
    require("./fieldOptionsFactory");

const {
    canonicalize,
    hashValue
} = require("./productionMutationPlanCanonicalizer");

const baseId =
    process.env.AIRTABLE_BASE_ID;

const REVIEW_TABLE_NAME =
    "Accommodatie beoordelingen";

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


    async assertReviewWriteAuthorization(
        tableName,
        recordId,
        action,
        fields,
        authorization
    ) {

        let reviewTable;

        if (tableName === REVIEW_TABLE_NAME) {
            reviewTable =
                await this.getTable(REVIEW_TABLE_NAME);
        } else if (
            typeof tableName === "string" &&
            /^tbl[A-Za-z0-9]+$/.test(tableName)
        ) {
            const matches =
                (await this.getTables()).filter(table =>
                    table?.id === tableName
                );

            if (matches.length !== 1) {
                throw new Error(
                    "AirtableAdapter: tabel-ID kan niet veilig worden herkend."
                );
            }

            if (matches[0].name !== REVIEW_TABLE_NAME) {
                return;
            }

            reviewTable = matches[0];
        } else {
            return;
        }

        if (
            !authorization ||
            typeof authorization !== "object" ||
            !authorization.planService ||
            !authorization.permit ||
            !authorization.operationId ||
            !authorization.operation
        ) {
            const error =
                new Error("AirtableAdapter: PlanStore-autorisatie is verplicht voor reviewwrites.");
            error.code = "PLAN_PERMIT_REQUIRED";
            throw error;
        }

        const {
            assertActiveOperation
        } = require("./productionMutationPlanService");

        const operation =
            assertActiveOperation(
                authorization.planService,
                authorization.permit,
                authorization.operationId,
                authorization.operation
            );+
        const target =
            operation.target;
        const payloadJson =
            canonicalize(fields);

        if (
            operation.system !== "airtable" ||
            operation.action !== action ||
            operation.payloadHash !== hashValue("payload", fields) ||
            canonicalize(operation.payload) !== payloadJson ||
            target?.provider !== "airtable" ||
            target.baseId !== baseId ||
            target.tableId !== reviewTable.id ||
            target.recordId !== (action === "update" ? recordId : null)
        ) {
            const error =
                new Error("AirtableAdapter: reviewwrite wijkt af van de actieve PlanStore-operatie.");
            error.code = "PLAN_OPERATION_MISMATCH";
            throw error;
        }

        const entityFields =
            reviewTable.fields.filter(field =>
                field?.id === target.entity?.fieldId
            );
        const pointFields =
            reviewTable.fields.filter(field =>
                field?.id === target.point?.fieldId
            );

        if (
            entityFields.length !== 1 ||
            pointFields.length !== 1 ||
            !target.entity?.recordId ||
            !target.point?.recordId
        ) {
            const error =
                new Error("AirtableAdapter: reviewwrite mist een eenduidig PlanStore-doel.");
            error.code = "PLAN_OPERATION_MISMATCH";
            throw error;
        }

        const entityFieldName =
            entityFields[0].name;
        const pointFieldName =
            pointFields[0].name;
        const currentRecords =
            await this.listRecords(REVIEW_TABLE_NAME);
        const matches =
            currentRecords.filter(record => {
                const hasLink = (value, recordId) =>
                    Array.isArray(value) &&
                    value.some(link =>
                        link === recordId ||
                        link?.id === recordId
                    );

                return (
                    hasLink(
                        record.fields?.[entityFieldName],
                        target.entity.recordId
                    ) &&
                    hasLink(
                        record.fields?.[pointFieldName],
                        target.point.recordId
                    )
                );
            });
        const preflightMatches =
            action === "create"
                ? matches.length === 0
                : matches.length === 1 &&
                    matches[0]?.id === recordId;

        if (!preflightMatches) {
            const error =
                new Error("AirtableAdapter: actuele reviewmatches wijken af van de actieve PlanStore-operatie.");
            error.code = "PLAN_PREFLIGHT_MISMATCH";
            throw error;
        }

    }


    async createRecord(
        tableName,
        fields,
        authorization
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

        try {
            await this.assertReviewWriteAuthorization(
                tableName,
                null,
                "create",
                fields,
                authorization
            );
        } catch (error) {
            const blocked =
                new Error(
                    error instanceof Error
                        ? error.message
                        : "Airtable reviewwrite is vóór de providerwrite geblokkeerd."
                );
            blocked.code =
                error?.code || "ADAPTER_WRITE_BLOCKED";
            blocked.adapterWriteStarted = false;
            blocked.cause = error;
            throw blocked;
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
        fields,
        authorization
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

        try {
            await this.assertReviewWriteAuthorization(
                tableName,
                recordId,
                "update",
                fields,
                authorization
            );
        } catch (error) {
            const blocked =
                new Error(
                    error instanceof Error
                        ? error.message
                        : "Airtable reviewwrite is vóór de providerwrite geblokkeerd."
                );
            blocked.code =
                error?.code || "ADAPTER_WRITE_BLOCKED";
            blocked.adapterWriteStarted = false;
            blocked.cause = error;
            throw blocked;
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


    async assertDeleteWriteAuthorization(
        tableName,
        recordId,
        authorization
    ) {

        if (
            !authorization ||
            typeof authorization !== "object" ||
            !authorization.planService ||
            !authorization.permit ||
            !authorization.operationId ||
            !authorization.operation
        ) {
            const error =
                new Error("AirtableAdapter: PlanStore-autorisatie is verplicht voor recordverwijderingen.");
            error.code = "PLAN_PERMIT_REQUIRED";
            throw error;
        }

        const {
            assertActiveOperation
        } = require("./productionMutationPlanService");

        const operation =
            assertActiveOperation(
                authorization.planService,
                authorization.permit,
                authorization.operationId,
                authorization.operation
            );

        if (
            operation.system !== "airtable" ||
            operation.action !== "delete" ||
            operation.target?.provider !== "airtable" ||
            operation.target.baseId !== baseId ||
            operation.target.recordId !== recordId
        ) {
            const error =
                new Error("AirtableAdapter: delete wijkt af van de actieve PlanStore-operatie.");
            error.code = "PLAN_OPERATION_MISMATCH";
            throw error;
        }

        const tables =
            await this.getTables();
        const matches =
            tables.filter(table =>
                /^tbl[A-Za-z0-9]+$/.test(tableName)
                    ? table?.id === tableName
                    : table?.name === tableName
            );

        if (
            matches.length !== 1 ||
            operation.target.tableId !== matches[0].id
        ) {
            const error =
                new Error("AirtableAdapter: delete-tabel wijkt af van de actieve PlanStore-operatie.");
            error.code = "PLAN_OPERATION_MISMATCH";
            throw error;
        }

    }


    async deleteRecord(
        tableName,
        recordId,
        authorization
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

        try {
            await this.assertDeleteWriteAuthorization(
                tableName,
                recordId,
                authorization
            );
        } catch (error) {
            const blocked =
                new Error(
                    error instanceof Error
                        ? error.message
                        : "Airtable recordverwijdering is vóór de providerwrite geblokkeerd."
                );
            blocked.code =
                error?.code || "ADAPTER_WRITE_BLOCKED";
            blocked.adapterWriteStarted = false;
            blocked.cause = error;
            throw blocked;
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