const comparisonService = require("./services/comparisonService");
const BuilderContext = require("./services/builderContext");

const moduleDefinition = {
    table: "Accommodaties",
    fields: [
        {
            name: "Description Test",
            type: "singleLineText",
            description: "Beschrijving vanuit Builder",
            options: {}
        },
        {
            name: "Nieuw veld",
            type: "singleLineText",
            description: "",
            options: {}
        }
    ]
};

const airtableFields = [
    {
        name: "Description Test",
        type: "singleLineText",
        description: "Beschrijving vanuit Airtable",
        options: {}
    }
];

const context = new BuilderContext({
    module: moduleDefinition,
    tableName: "Accommodaties",
    airtableFields,
    logger: null,
    options: {}
});

const results = comparisonService.compareModule(context);

comparisonService.printModule(results);

console.log("================================");
console.log("Samenvatting");
console.log("================================");

const existing = results.filter(r => r.exists).length;
const missing = results.filter(r => !r.exists).length;
const changed = results.filter(
    r => r.exists && r.comparison.hasDifferences
).length;

console.log(`Bestaande velden : ${existing}`);
console.log(`Nieuwe velden    : ${missing}`);
console.log(`Gewijzigde velden: ${changed}`);
console.log("");