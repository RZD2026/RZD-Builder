async function resolveReferences(input) {

    const model = input.model || input;

    for (const table of model.tables) {

        for (const field of table.fields) {

            field.listRef = null;
            field.hasList = false;
            field.listValues = [];

            if (!field.list) {
                continue;
            }

            field.listRef = model.lookup.lists[field.list] || null;

            if (!field.listRef) {

                model.warnings.push({
                    type: "unknown-list",
                    table: table.id,
                    field: field.id,
                    list: field.list
                });

                continue;

            }

            field.hasList = true;
            field.listValues = field.listRef.values || [];

        }

    }

    return model;

}

module.exports = resolveReferences;
