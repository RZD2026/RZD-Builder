const fieldComparer = require("./services/fieldComparer");

const localField = {
    name: "Test",
    type: "number",
    description: "Lokale beschrijving",
    options: {
        precision: 1
    }
};

const airtableField = {
    name: "Test",
    type: "number",
    description: "Andere beschrijving",
    options: {
        precision: 0
    }
};

const differences = fieldComparer.compare(
    localField,
    airtableField
);

console.log("");
console.log("==============================");
console.log("RZD FieldComparer Test");
console.log("==============================");
console.log("");

if (differences.length === 0) {

    console.log("Geen verschillen.");

} else {

    console.log("Verschillen:");

    differences.forEach(item => {
        console.log("- " + item);
    });

}

console.log("");
