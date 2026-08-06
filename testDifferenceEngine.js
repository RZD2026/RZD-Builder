const fieldComparer = require("./services/fieldComparer");
const differenceEngine = require("./services/differenceEngine");

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

const result = differenceEngine.build(
    localField,
    airtableField,
    differences
);

console.log("");
console.log("================================");
console.log("RZD Difference Engine Test");
console.log("================================");
console.log("");

if (result.length === 0) {

    console.log("Geen verschillen gevonden.");

} else {

    result.forEach(item => {

        console.log("--------------------------------");
        console.log(`Eigenschap : ${item.property}`);
        console.log(`Builder    : ${item.local}`);
        console.log(`Airtable   : ${item.remote}`);

    });

}

console.log("");