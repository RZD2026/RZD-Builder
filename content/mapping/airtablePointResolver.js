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

    matchesConfiguredPoint(mapping, point) {

        const configuredPoint =
            mapping?.airtable;

        if (!configuredPoint || !point) {
            return false;
        }

        const hasConfiguredRecordId =
            typeof configuredPoint.recordId === "string" &&
            configuredPoint.recordId !== "";
        const recordIdMatches =
            !hasConfiguredRecordId ||
            configuredPoint.recordId === point.recordId;
        const pointNameIsMissing =
            point.name === undefined ||
            point.name === null ||
            point.name === "";

        return (
            recordIdMatches &&
            configuredPoint.module === point.moduleName &&
            (
                pointNameIsMissing
                    ? hasConfiguredRecordId && recordIdMatches
                    : point.name === configuredPoint.name
            )
        );

    }

    // lookup ({ modules, points }) is optioneel; zonder lookup worden beide opgehaald.
    async resolve(mapping, lookup) {

        if (!mapping || mapping.status === "NO_MATCH") {
            return {
                status: "NO_MATCH",
                recordId: null
            };
        }

        const modules =
            lookup?.modules ?? await this.getModules();

        const points =
            lookup?.points ?? await this.getPoints();
         
        const moduleRecord =
          modules.find(
            record =>
                record.fields["Module naam"] ===
                mapping.airtable.module

 );

        if (!moduleRecord) {
            return {
                status: "NO_MATCH",
                recordId: null
            };
        }

        const point = mapping.airtable.recordId
            ? points.find(record =>
                record.id === mapping.airtable.recordId
            )
            : points.find(record => {
                const pointModule =
                    record.fields?.["Module"] || [];

                return (
                    record.fields?.["Beoordelingspunt"] ===
                        mapping.airtable.name &&
                    pointModule.includes(moduleRecord.id)
                );
            });

        const pointFields = point?.fields || {};
        const pointModule = pointFields["Module"] || [];
        const pointName = pointFields["Beoordelingspunt"];
        const moduleName = moduleRecord.fields?.["Module naam"];

        if (
            !point ||
            !pointModule.includes(moduleRecord.id) ||
            !this.matchesConfiguredPoint(mapping, {
                recordId: point.id,
                moduleName,
                name: pointName
            })
        ) {
            return {
                status: "NO_MATCH",
                recordId: null
            };
        }

        return {
            status: mapping.status,
            recordId: point.id,
            name: pointName || mapping.airtable.name,
            moduleRecordId: moduleRecord.id
        };

    }

}

module.exports =
    new AirtablePointResolver();