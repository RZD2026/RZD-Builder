require("dotenv").config();

const axios = require("axios");

const baseId =
    process.env.AIRTABLE_BASE_ID;

const token =
    process.env.AIRTABLE_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`
};


const TEST_PATTERN =
    /\btest\b/i;


async function getTables() {

    const response =
        await axios.get(
            `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
            {
                headers
            }
        );

    return response.data.tables || [];

}


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

        const response =
            await axios.get(
                `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
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


function getPrimaryField(table) {

    return (
        table.fields.find(
            field => field.primary
        ) ||
        table.fields[0]
    );

}


function getTextValues(fields) {

    const values = [];

    for (
        const [fieldName, value]
        of Object.entries(fields || {})
    ) {

        if (typeof value === "string") {

            values.push({
                field: fieldName,
                value
            });

            continue;
        }

        if (Array.isArray(value)) {

            for (const item of value) {

                if (
                    typeof item === "string" &&
                    TEST_PATTERN.test(item)
                ) {

                    values.push({
                        field: fieldName,
                        value: item
                    });

                }

            }

        }

    }

    return values;

}


function hasTestText(fields) {

    return getTextValues(fields).length > 0;

}


async function run() {

    console.log("");
    console.log(
        "===== RZD 5.1 TEST DATA AUDIT ====="
    );
    console.log("");

    const tables =
        await getTables();


    console.log(
        "Aantal Airtable-tabellen:",
        tables.length
    );

    console.log("");

    console.log(
        "Tabellen:"
    );

    for (const table of tables) {

        console.log(
            `- ${table.name}`
        );

    }

    console.log("");


    const tableRecords = {};


    for (const table of tables) {

        console.log(
            `Records ophalen: ${table.name}`
        );

        tableRecords[table.name] =
            await getAllRecords(
                table.name
            );

        console.log(
            `  ${tableRecords[table.name].length} records`
        );

    }


    console.log("");
    console.log(
        "===== TEST-DATA AUDIT ====="
    );
    console.log("");


    let totalCandidates = 0;


    for (const table of tables) {

        const records =
            tableRecords[table.name];

        const candidates =
            records.filter(
                record =>
                    hasTestText(
                        record.fields
                    )
            );


        if (candidates.length === 0) {
            continue;
        }


        totalCandidates +=
            candidates.length;


        const primaryField =
            getPrimaryField(table);


        console.log("");
        console.log(
            "----------------------------------------"
        );

        console.log(
            "TABEL:",
            table.name
        );

        console.log(
            "Mogelijke testrecords:",
            candidates.length
        );


        for (const record of candidates) {

            console.log("");

            console.log(
                "Record ID:",
                record.id
            );

            console.log(
                "Aangemaakt:",
                record.createdTime
            );


            if (primaryField) {

                console.log(
                    `${primaryField.name}:`,
                    record.fields?.[
                        primaryField.name
                    ] || "-"
                );

            }


            const matches =
                getTextValues(
                    record.fields
                );


            for (const match of matches) {

                console.log(
                    `  ${match.field}:`,
                    match.value
                );

            }

        }

    }


    /*
     * Speciale controle voor
     * Accommodatie Beoordelingen.
     *
     * Gekoppelde Airtable-records bevatten
     * alleen IDs. Daarom koppelen we hier
     * de accommodatie-ID terug aan de
     * accommodatienaam.
     */

    const accommodations =
        tableRecords["Accommodaties"] || [];

    const reviews =
        tableRecords[
            "Accommodatie Beoordelingen"
        ] || [];


    if (
        accommodations.length > 0 &&
        reviews.length > 0
    ) {

        const accommodationMap =
            new Map();


        for (
            const accommodation
            of accommodations
        ) {

            const name =
                accommodation.fields?.[
                    "Naam accommodatie"
                ] ||
                accommodation.fields?.[
                    "Naam"
                ] ||
                Object.values(
                    accommodation.fields || {}
                ).find(
                    value =>
                        typeof value === "string"
                ) ||
                "-";


            accommodationMap.set(
                accommodation.id,
                name
            );

        }


        console.log("");
        console.log(
            "===== REVIEW → TEST-ACCOMMODATIE ====="
        );
        console.log("");


        let linkedTestReviews = 0;


        for (const review of reviews) {

            const accommodationLinks =
                review.fields?.Accommodatie;


            if (
                !Array.isArray(
                    accommodationLinks
                )
            ) {
                continue;
            }


            const names =
                accommodationLinks
                    .map(
                        id =>
                            accommodationMap.get(
                                id
                            )
                    )
                    .filter(Boolean);


            const hasTestAccommodation =
                names.some(
                    name =>
                        TEST_PATTERN.test(
                            name
                        )
                );


            if (!hasTestAccommodation) {
                continue;
            }


            linkedTestReviews++;


            console.log("--------------------------------");

            console.log(
                "Review ID:",
                review.id
            );

            console.log(
                "Accommodatie:",
                names.join(", ")
            );

            console.log(
                "Beoordeling naam:",
                review.fields?.[
                    "Beoordeling naam"
                ] || "-"
            );

            console.log(
                "Aangemaakt:",
                review.createdTime
            );

        }


        console.log("");

        console.log(
            "Reviews gekoppeld aan TEST-accommodaties:",
            linkedTestReviews
        );

    }


    console.log("");
    console.log(
        "===== SAMENVATTING ====="
    );

    console.log(
        "Mogelijke testrecords met tekst:",
        totalCandidates
    );

    console.log("");

    console.log(
        "LET OP: er is niets gewijzigd."
    );

    console.log(
        "Dit is uitsluitend een read-only audit."
    );

    console.log("");

    console.log(
        "===== AUDIT GESLAAGD ====="
    );

    console.log("");

}


run().catch(error => {

    console.error("");
    console.error(
        "===== AUDIT MISLUKT ====="
    );
    console.error("");

    console.error(
        error.response?.data ||
        error.message
    );

    process.exit(1);

});