const reviewWrite = require("../services/reviewWriteService");
const airtableAdapter = require("../services/airtableAdapter");

async function runTests() {

    console.log("");
    console.log("===== REVIEW WRITE SERVICE DRY-RUN TEST =====");
    console.log("");

    // Mock data and monkeypatch adapter.listRecords

    // Scenario A: 0 matches
    airtableAdapter.listRecords = async (tableName) => {
        return [];
    };

    const fieldsA = {
        "Beoordeling naam": "Karios - Toegang",
        "Accommodatie": ["recKarios"],
        "Beoordelingspunt": ["recPoint1"],
        "Status": "Nog niet beoordeeld"
    };

    const resA = await reviewWrite.upsertReview({
        accommodationId: "recKarios",
        pointId: "recPoint1",
        fields: fieldsA,
        dryRun: true
    });

    console.log("--- Scenario A: 0 matches ---");
    console.log("Matches:", resA.matches);
    console.log("Action:", resA.action);
    console.log("Planned fields:", resA.plannedFields);
    console.log("GEEN WRITE UITGEVOERD");
    console.log("");

    // Scenario B: 1 match
    airtableAdapter.listRecords = async (tableName) => {
        return [
            {
                id: "recExisting1",
                fields: {
                    "Accommodatie": ["recKarios"],
                    "Beoordelingspunt": ["recPoint1"],
                    "Waarde / Resultaat": "oud",
                    "Foto / Bewijs": [],
                    "Opmerking": "oude opmerking"
                }
            }
        ];
    };

    const fieldsB = {
        "Beoordeling naam": "Karios - Toegang (nieuw)",
        // Note: not providing Waarde / Resultaat, Foto or Opmerking => should not clear them
        "Status": "Nog niet beoordeeld"
    };

    const resB = await reviewWrite.upsertReview({
        accommodationId: "recKarios",
        pointId: "recPoint1",
        fields: fieldsB,
        dryRun: true
    });

    console.log("--- Scenario B: 1 match ---");
    console.log("Matches:", resB.matches);
    console.log("Action:", resB.action);
    console.log("Match IDs:", resB.matchIds);
    console.log("Planned update fields:", resB.plannedFields);
    console.log("GEEN WRITE UITGEVOERD");
    console.log("");

    // Scenario C: >1 matches (use Karios duplicates)
    airtableAdapter.listRecords = async (tableName) => {
        return [
            { id: "recDup1", fields: { "Accommodatie": ["recKarios"], "Beoordelingspunt": ["recPoint1"] } },
            { id: "recDup2", fields: { "Accommodatie": ["recKarios"], "Beoordelingspunt": ["recPoint1"] } }
        ];
    };

    const fieldsC = {
        "Beoordeling naam": "Karios - Toegang (dup test)",
        "Status": "Nog niet beoordeeld"
    };

    const resC = await reviewWrite.upsertReview({
        accommodationId: "recKarios",
        pointId: "recPoint1",
        fields: fieldsC,
        dryRun: true
    });

    console.log("--- Scenario C: >1 matches ---");
    console.log("Matches:", resC.matches);
    console.log("Action:", resC.action);
    console.log("Match IDs:", resC.matchIds);
    console.log("GEEN WRITE UITGEVOERD");
    console.log("");

}

runTests().catch(err => {
    console.error(err);
    process.exit(1);
});
