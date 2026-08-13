require("dotenv").config();

const Airtable =
    require("airtable");

const airtableAdapter =
    require("../services/airtableAdapter");
const reviewWriteService =
    require("../services/reviewWriteService");


const REVIEW_TABLE =
    "Accommodatie beoordelingen";

const ACCOMMODATION_ID =
    "recQzECjVOUbQjc5g";

const ACCOMMODATION_NAME =
    "Karios Hotel - Peschiera del Garda";

const POINT_ID =
    "recW86AELDqOyMcPZ";

const POINT_NAME =
    "Parkeerplaats aanwezig";


async function run() {

    console.log("");
    console.log("===== RZD 5.1 UPSERT RECORD TEST =====");
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
        "Bestaande matches:",
        matches.length
    );

    if (matches.length > 1) {

        throw new Error(
            `MEERDERE bestaande records gevonden (${matches.length}). ` +
            "Geen write uitgevoerd."
        );

    }

    const fields = {

        "Beoordeling naam":
            `${ACCOMMODATION_NAME} - ${POINT_NAME}`,

        "Accommodatie":
            [ACCOMMODATION_ID],

        "Beoordelingspunt":
            [POINT_ID],

        "Status":
            "Nog niet beoordeeld"

    };


    if (matches.length === 1) {

        const existing =
            matches[0];

        console.log("");
        console.log(
            "Bestaand record gevonden:"
        );

        console.log(
            "Record ID:",
            existing.id
        );

        console.log(
            "Actie: UPDATE"
        );

        console.log("");
        console.log(
            "Velden:"
        );

        console.dir(
            fields,
            { depth: null }
        );

        const upsert = await reviewWriteService.upsertReview({
            accommodationId: ACCOMMODATION_ID,
            pointId: POINT_ID,
            fields: fields,
            dryRun: true
        });

        console.log("");
        console.log("===== UPDATE (DRY-RUN) GEDRAAIWD =====");
        console.log("Resultaat:", upsert.action, upsert.recordId ? `(${upsert.recordId})` : "");

        return;

    }


    console.log("");
    console.log(
        "Geen bestaand record gevonden."
    );

    console.log(
        "Actie: CREATE"
    );

    console.log("");
    console.log(
        "Velden:"
    );

    console.dir(
        fields,
        { depth: null }
    );

    const upsert = await reviewWriteService.upsertReview({
        accommodationId: ACCOMMODATION_ID,
        pointId: POINT_ID,
        fields: fields,
        dryRun: true
    });

    console.log("");
    console.log("===== CREATE (DRY-RUN) GEDRAAIWD =====");
    console.log("Resultaat:", upsert.action, upsert.recordId ? `(${upsert.recordId})` : "");

}


run().catch(error => {

    console.error("");
    console.error(
        "===== UPSERT TEST MISLUKT ====="
    );
    console.error("");
    console.error(error);
    process.exit(1);

});