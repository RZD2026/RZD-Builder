require("dotenv").config();

const axios = require("axios");

const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};

const ACCOMMODATION_TABLE = "Accommodaties";
const REVIEW_TABLE = "Accommodatie beoordelingen";

const TEST_ACCOMMODATION_IDS = [
    "receCbuC0qSuQAZK0",
    "recu7druA9BMOZhDk"
];


async function getAllRecords(tableName) {

    const records = [];
    let offset = null;

    do {

        const params = {
            pageSize: 100
        };

        if (offset) {
            params.offset = offset;
        }

        const response = await axios.get(
            `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
            {
                headers,
                params
            }
        );

        records.push(
            ...(response.data.records || [])
        );

        offset = response.data.offset || null;

    } while (offset);

    return records;
}


function linkedIds(value) {

    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map(item =>
            typeof item === "string"
                ? item
                : item?.id || null
        )
        .filter(Boolean);
}


function accommodationName(record) {

    return (
        record.fields?.["Naam"] ||
        record.fields?.["Naam accommodatie"] ||
        record.fields?.["Accommodatienaam"] ||
        Object.values(record.fields || {})
            .find(value => typeof value === "string") ||
        "-"
    );
}


async function run() {

    console.log("");
    console.log("===== RZD 5.1 REVIEW LINK AUDIT =====");
    console.log("");

    const accommodations =
        await getAllRecords(
            ACCOMMODATION_TABLE
        );

    const reviews =
        await getAllRecords(
            REVIEW_TABLE
        );

    const accommodationMap =
        new Map();

    for (const accommodation of accommodations) {

        accommodationMap.set(
            accommodation.id,
            accommodationName(accommodation)
        );

    }

    console.log(
        "Aantal accommodaties:",
        accommodations.length
    );

    console.log(
        "Aantal reviewrecords:",
        reviews.length
    );

    console.log("");

    let totalTestReviews = 0;


    for (const accommodationId of TEST_ACCOMMODATION_IDS) {

        const name =
            accommodationMap.get(
                accommodationId
            ) || "(onbekende accommodatie)";

        const linkedReviews =
            reviews.filter(review => {

                const ids =
                    linkedIds(
                        review.fields?.Accommodatie
                    );

                return ids.includes(
                    accommodationId
                );

            });

        console.log(
            "========================================"
        );

        console.log(
            "ACCOMMODATIE:",
            name
        );

        console.log(
            "Accommodatie ID:",
            accommodationId
        );

        console.log(
            "Aantal gekoppelde reviews:",
            linkedReviews.length
        );

        console.log("");

        for (const review of linkedReviews) {

            const pointIds =
                linkedIds(
                    review.fields?.Beoordelingspunt
                );

            console.log(
                "Record ID:",
                review.id
            );

            console.log(
                "Beoordeling naam:",
                review.fields?.[
                    "Beoordeling naam"
                ] || "-"
            );

            console.log(
                "Beoordelingspunt ID:",
                pointIds.join(", ") || "-"
            );

            console.log(
                "Waarde:",
                review.fields?.[
                    "Waarde / Resultaat"
                ] || "-"
            );

            console.log(
                "Status:",
                review.fields?.Status || "-"
            );

            console.log(
                "Aangemaakt:",
                review.createdTime
            );

            console.log("");
        }

        totalTestReviews +=
            linkedReviews.length;

    }


    console.log(
        "========================================"
    );

    console.log("");
    console.log("===== SAMENVATTING =====");

    console.log(
        "TEST-accommodaties:",
        TEST_ACCOMMODATION_IDS.length
    );

    console.log(
        "Gekoppelde reviewrecords:",
        totalTestReviews
    );

    console.log("");

    console.log(
        "LET OP: er is niets gewijzigd."
    );

    console.log(
        "Dit is uitsluitend een read-only controle."
    );

    console.log("");
    console.log(
        "===== AUDIT GESLAAGD ====="
    );
    console.log("");

}


run().catch(error => {

    console.error("");
    console.error("===== AUDIT MISLUKT =====");
    console.error("");

    console.error(
        error.response?.data ||
        error.message
    );

    process.exit(1);

});