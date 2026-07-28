
function schema(model) {

    const report = {

        tablesWithoutFields: [],
        duplicateTableIds: []

    };

    const ids = new Set();

    for (const table of model.tables) {

        if (ids.has(table.id)) {

            report.duplicateTableIds.push({
                table: table.id
            });

            continue;

        }

        ids.add(table.id);

        if (!table.fields || table.fields.length === 0) {

            report.tablesWithoutFields.push({
                table: table.id
            });

        }

    }

    return report;

}

module.exports = schema;