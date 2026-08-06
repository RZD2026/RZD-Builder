async function resolveReferences(input) {

    const context = input.model ? input : { model: input };
    const model = context.model;

    for (const table of model.tables) {

        for (const field of table.fields) {

            field.listRef = null;
            field.hasList = false;
            field.listValues = [];

            if (!field.list) {
                continue;
            }

            field.listRef = context.lookup.lists[field.list] || null;

            if (!field.listRef) {

                context.warnings.push({
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
