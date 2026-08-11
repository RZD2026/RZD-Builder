require("dotenv").config();

const axios = require("axios");

class AirtablePointResolver {

    constructor() {

        this.baseId =
            process.env.AIRTABLE_BASE_ID;

        this.token =
            process.env.AIRTABLE_TOKEN;

        this.headers = {
            Authorization: `Bearer ${this.token}`
        };

    }

    async getModules() {

        const response = await axios.get(
            `https://api.airtable.com/v0/${this.baseId}/Modules`,
            {
                headers: this.headers
            }
        );

        return response.data.records;

    }

    async getPoints() {

        const response = await axios.get(
            `https://api.airtable.com/v0/${this.baseId}/Beoordelingspunten`,
            {
                headers: this.headers
            }
        );

        return response.data.records;

    }

    async resolve(mapping) {

        if (!mapping || mapping.status === "NO_MATCH") {
            return {
                status: "NO_MATCH",
                recordId: null
            };
        }

        const modules =
            await this.getModules();

        const points =
            await this.getPoints();
         
        const moduleRecord =
          modules.find(
            record =>
                record.fields["Module naam"] ===
                mapping.airtable.module

 );

        if (!module) {
            return {
                status: "NO_MATCH",
                recordId: null
            };
        }

        const point =
            points.find(record => {

                const pointModule =
                    record.fields["Module"] || [];

                return (
                    record.fields["Beoordelingspunt"] ===
                        mapping.airtable.name &&
                    pointModule.includes(moduleRecord.id)
                );

            });

        if (!point) {
            return {
                status: "NO_MATCH",
                recordId: null
            };
        }

        return {
            status: mapping.status,
            recordId: point.id,
            name:
                point.fields["Beoordelingspunt"],
            moduleRecordId: moduleRecord.id
        };

    }

}

module.exports =
    new AirtablePointResolver();