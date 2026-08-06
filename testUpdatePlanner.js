const fieldComparer = require("./services/fieldComparer");
const updatePlanner = require("./services/updatePlanner");

const localField = {
    name: "Description Test",
    type: "number",
    description: "Beschrijving vanuit Builder",
    options: {
        precision: 1
    }
};

const airtableField = {
    name: "Description Test",
    type: "number",
    description: "Beschrijving vanuit Airtable",
    options: {
        precision: 0
    }
};

console.log("");
console.log("================================");
console.log("RZD UpdatePlanner Test");
console.log("================================");
console.log("");

// Stap 1 - verschillen bepalen
const differences = fieldComparer.compare(
    localField,
    airtableField
);

console.log("Verschillen");
console.log("--------------------------------");

if (differences.length === 0) {

    console.log("Geen verschillen gevonden.");

} else {

    differences.forEach(diff => {
        console.log("✔ " + diff);
    });

}

console.log("");

// Stap 2 - PATCH payload opbouwen
const payload = updatePlanner.build(
    localField,
    airtableField,
    differences
);

console.log("PATCH Payload");
console.log("--------------------------------");

console.dir(payload, {
    depth: null
});

console.log("");

console.log(
    "Payload bevat updates:",
    updatePlanner.hasUpdates(payload) ? "JA" : "NEE"
);

console.log("");