const comparisonService = require("./services/comparisonService");

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

const comparison = comparisonService.compare(
    localField,
    airtableField
);

console.log("");
console.log("================================");
console.log("RZD Comparison Service Test");
console.log("================================");

comparisonService.print(
    localField.name,
    comparison
);

console.log("");

if (comparison.hasDifferences) {

    console.log("Samenvatting");
    console.log("--------------------------------");
    console.log(`Aantal verschillen : ${comparison.differences.length}`);

} else {

    console.log("Geen verschillen gevonden.");

}

console.log("");