require("dotenv").config();

const airtableAdapter =
    require("../services/airtableAdapter");


const REVIEW_TABLE =
    "Accommodatie beoordelingen";

const ACCOMMODATION_ID =
    "recQzECjVOUbQjc5g";


function containsLinkedRecord(
    fieldValue,
    recordId
) {

    if (!Array.isArray(fieldValue)) {
        return false;
    }

    return fieldValue.some(value => {

        if (typeof value === "string") {
            return value === recordId;
        }

        if (
            value &&
            typeof value === "object"
        ) {
            return value.id === recordId;
        }

        return false;

    });

}


async function run() {

    console.log("");
    console.log(
        "===== RZD 5.1 KARIOS DUPLICATE INSPECTION ====="
    );
    console.log("");

    console.log(
        "Accommodatie:",
        ACCOMMODATION_ID
    );

    console.log("");

    const records =
        await airtableAdapter.listRecords(
            REVIEW_TABLE
        );

    const matches =
        records.filter(record => {

            return containsLinkedRecord(
                record.fields?.Accommodatie,
                ACCOMMODATION_ID
            );

        });

    console.log(
        "Aantal beoordelingen voor Karios:",
        matches.length
    );

    console.log("");

    const byPoint =
        new Map();

    for (const record of matches) {

        const pointIds =
            record.fields?.Beoordelingspunt || [];

        for (const pointId of pointIds) {

            if (!byPoint.has(pointId)) {
                byPoint.set(
                    pointId,
                    []
                );
            }

            byPoint
                .get(pointId)
                .push(record);

        }

    }

    let duplicateGroups = 0;

    for (
        const [
            pointId,
            pointRecords
        ] of byPoint
    ) {

        if (pointRecords.length < 2) {
            continue;
        }

        duplicateGroups++;

        console.log(
            "========================================"
        );

        console.log(
            "DUBBELE BEOORDELING"
        );

        console.log(
            "Beoordelingspunt ID:",
            pointId
        );

        console.log(
            "Aantal records:",
            pointRecords.length
        );

        console.log("");

        for (const record of pointRecords) {

            console.log(
                "--- Record:",
                record.id
            );

            console.log(
                "Beoordeling naam:",
                record.fields?.["Beoordeling naam"] ||
                "(leeg)"
            );

            console.log(
                "Status:",
                record.fields?.Status ||
                "(leeg)"
            );

            console.log(
                "Waarde / Resultaat:",
                record.fields?.["Waarde / Resultaat"] ||
                "(leeg)"
            );

            console.log(
                "Opmerking:",
                record.fields?.Opmerking ||
                "(leeg)"
            );

            console.log(
                "Foto / Bewijs:",
                record.fields?.["Foto / Bewijs"] ||
                "(leeg)"
            );

            console.log("");

        }

    }

    console.log(
        "========================================"
    );

    console.log(
        "Aantal dubbele beoordelingspunten:",
        duplicateGroups
    );

    console.log("");

    console.log(
        "===== INSPECTIE GESLAAGD ====="
    );

    console.log(
        "Geen wijzigingen uitgevoerd."
    );

    console.log("");

}


run().catch(error => {

    console.error("");
    console.error(
        "===== INSPECTIE MISLUKT ====="
    );
    console.error("");

    console.error(error);

    process.exit(1);

});