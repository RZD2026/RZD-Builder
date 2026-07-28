const references = require("./references");
const fields = require("./fields");
const lists = require("./lists");
const registry = require("./registry");
const schema = require("./schema");
const { printGroup } = require("./reporter");

async function doctor(model) {

    const report = {

        references: references(model),
        fields: fields(model),
        lists: lists(model),
        registry: registry(model),
        schema: schema(model),

        warnings: model.warnings,
        errors: model.errors

    };

    const hasMessages =
        report.references.unknownLists.length ||
        report.fields.missingIds.length ||
        report.fields.invalidIds.length ||
        report.fields.duplicateFieldIds.length ||
        report.fields.missingTypes.length ||
        report.fields.unknownTypes.length ||
        report.fields.missingLabels.length ||
        report.lists.emptyLists.length ||
        report.lists.unusedLists.length ||
        report.registry.missingRegistry.length ||
        report.registry.duplicateRegistryIds.length ||
        report.schema.tablesWithoutFields.length ||
        report.schema.duplicateTableIds.length;

    if (hasMessages) {

        console.log("");
        console.log("=== Builder Doctor ===");

    }

    printGroup("", report.references.unknownLists,
        w => `⚠ Unknown list '${w.list}' in ${w.table}.${w.field}`);

    printGroup("", report.fields.missingIds,
        f => `⚠ Missing field id in ${f.table}`);

    printGroup("", report.fields.invalidIds,
        f => `⚠ Invalid field id '${f.field}' in ${f.table}`);

    printGroup("", report.fields.duplicateFieldIds,
        f => `⚠ Duplicate field id '${f.field}' in ${f.table}`);

    printGroup("", report.fields.missingTypes,
        f => `⚠ Missing type in ${f.table}.${f.field}`);

    printGroup("", report.fields.unknownTypes,
        f => `⚠ Unknown field type '${f.type}' in ${f.table}.${f.field}`);

    printGroup("", report.fields.missingLabels,
        f => `⚠ Missing label in ${f.table}.${f.field}`);

    printGroup("", report.lists.emptyLists,
        l => `⚠ Empty list '${l.list}'`);

    printGroup("", report.lists.unusedLists,
        l => `⚠ Unused list '${l.list}'`);

    printGroup("", report.registry.missingRegistry,
        r => `⚠ ${r.message}`);

    printGroup("", report.registry.duplicateRegistryIds,
        r => `⚠ Duplicate registry id '${r.id}'`);

    printGroup("", report.schema.tablesWithoutFields,
        t => `⚠ Table '${t.table}' has no fields`);

    printGroup("", report.schema.duplicateTableIds,
        t => `⚠ Duplicate table id '${t.table}'`);

    return report;

}

module.exports = doctor;
