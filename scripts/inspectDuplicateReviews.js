require("dotenv").config();

const axios = require("axios");

const baseId =
    process.env.AIRTABLE_BASE_ID;

const token =
    process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};

const REVIEW_TABLE =
    "Accommodatie Beoordelingen";

const ACCOMMODATION_ID =
    "receCbuC0qSuQAZK0";


async function getAllRecords() {

    const records = [];
    let offset = null;

    do {

        const params = {
            pageSize: 100
        };

        if (offset) {
            params.offset = offset;
        }

        const response =
            await axios.get(
                `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(REVIEW_TABLE)}`,
                {
                    headers,
                    params
                }
            );

        records.push(
            ...(response.data.records || [])
        );

        offset =
            response.data.offset || null;

    } while (offset);

    return records;
}


function getLinkedIds(value) {

    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map(item => {

            if (typeof item === "string") {
                return item;
            }

            if (
                item &&
                typeof item === "object"
            ) {
                return item.id || null;
            }

            return null;

        })
        .filter(Boolean);

}


async function run() {

    console.log("");
    console.log(
        "===== RZD 5.1 DUPLICATE REVIEW INSPECT ====="
    );
    console.log("");

    console.log(
        "Accommodatie:",
        ACCOMMODATION_ID
    );

    console.log("");

    const records =
        await getAllRecords();

    console.log(
        "Totaal reviewrecords:",
        records.length
    );

    console.log("");

    const accommodationRecords =
        records.filter(record => {

            const accommodationIds =
                getLinkedIds(
                    record.fields?.Accommodatie
                );

            return accommodationIds.includes(
                ACCOMMODATION_ID
            );

        });

    console.log(
        "Records voor TEST 42:",
        accommodationRecords.length
    );

    console.log("");


    const groups = {};


    for (
        const record
        of accommodationRecords
    ) {

        const pointIds =
            getLinkedIds(
                record.fields?.Beoordelingspunt
            );

        const pointName =
            record.fields?.["Beoordeling naam"] ||
            "(geen naam)";


        const key =
            pointIds.length > 0
                ? pointIds[0]
                : "(geen beoordelingspunt)";


        if (!groups[key]) {

            groups[key] = [];

        }


        groups[key].push({
            id: record.id,
            pointName,
            createdTime:
                record.createdTime,
            fields:
                record.fields
        });

    }


    console.log(
        "===== PER BEOORDELINGSPUNT ====="
    );

    console.log("");


    for (
        const [pointId, group]
        of Object.entries(groups)
    ) {

        console.log("--------------------------------");

        console.log(
            "Beoordelingspunt ID:",
            pointId
        );

        console.log(
            "Aantal records:",
            group.length
        );


        for (
            const record
            of group
        ) {

            console.log("");

            console.log(
                "Record ID:",
                record.id
            );

            console.log(
                "Beoordeling naam:",
                record.pointName
            );

            console.log(
                "Aangemaakt:",
                record.createdTime
            );

        }

    }


    console.log("");
    console.log(
        "===== DUBBELE RECORDS ====="
    );
    console.log("");


    let duplicateGroups = 0;
    let duplicateRecords = 0;


    for (
        const [pointId, group]
        of Object.entries(groups)
    ) {

        if (group.length <= 1) {
            continue;
        }

        duplicateGroups++;

        duplicateRecords +=
            group.length - 1;

        console.log("--------------------------------");

        console.log(
            "Punt:",
            pointId
        );

        console.log(
            "Records:",
            group.length
        );

        console.log(
            "Te veel:",
            group.length - 1
        );

        console.log(
            "IDs:",
            group.map(
                record => record.id
            )
        );

    }


    console.log("");
    console.log(
        "===== SAMENVATTING ====="
    );

    console.log(
        "Beoordelingspunten met duplicaten:",
        duplicateGroups
    );

    console.log(
        "Overtollige records:",
        duplicateRecords
    );

    console.log("");

    console.log(
        "===== INSPECT GESLAAGD ====="
    );

    console.log("");

}


run().catch(error => {

    console.error("");
    console.error(
        "===== INSPECT MISLUKT ====="
    );
    console.error("");

    if (error.response) {

        console.error(
            error.response.data
        );

    } else {

        console.error(
            error.message
        );

    }

    process.exit(1);

});