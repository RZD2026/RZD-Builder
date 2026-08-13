require("dotenv").config();

const Airtable =
    require("airtable");


const REVIEW_TABLE =
    "Accommodatie beoordelingen";

const ACCOMMODATION_ID =
    "recQzECjVOUbQjc5g";

const POINT_ID =
    "recW86AELDqOyMcPZ";


async function run() {

    console.log("");
    console.log("===== RZD 5.1 DUPLICATE INSPECTION =====");
    console.log("");

    const base =
        new Airtable({
            apiKey:
                process.env.AIRTABLE_TOKEN
        }).base(
            process.env.AIRTABLE_BASE_ID
        );

    const records =
        await base(
            REVIEW_TABLE
        )
        .select({
            maxRecords: 100
        })
        .firstPage();

    const matches =
        records.filter(record => {

            const accommodation =
                record.fields.Accommodatie || [];

            const point =
                record.fields.Beoordelingspunt || [];

            return (
                accommodation.includes(
                    ACCOMMODATION_ID
                ) &&
                point.includes(
                    POINT_ID
                )
            );

        });

    console.log(
        "Aantal dubbele records:",
        matches.length
    );

    console.log("");

    for (const record of matches) {

        console.log("--------------------------------");
        console.log(
            "Record ID:",
            record.id
        );

        console.log(
            "Aangemaakt:",
            record._rawJson?.createdTime ||
            "onbekend"
        );

        console.log(
            "Beoordeling naam:",
            record.fields["Beoordeling naam"] ||
            "(leeg)"
        );

        console.log(
            "Waarde / Resultaat:",
            record.fields["Waarde / Resultaat"] ||
            "(leeg)"
        );

        console.log(
            "Status:",
            record.fields.Status ||
            "(leeg)"
        );

        console.log(
            "Foto / Bewijs:",
            record.fields["Foto / Bewijs"] ||
            "(leeg)"
        );

        console.log(
            "Opmerking:",
            record.fields.Opmerking ||
            "(leeg)"
        );

    }

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