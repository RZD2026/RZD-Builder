
function buildLookups(input) {

    const context = input.model ? input : { model: input };
    const model = context.model;

    context.lookup.tables = Object.fromEntries(
        model.tables.map(table => [table.id, table])
    );

    context.lookup.lists = Object.fromEntries(
        model.lists.map(list => [list.id, list])
    );

    context.lookup.fields = {};

    for (const table of model.tables) {

        context.lookup.fields[table.id] = Object.fromEntries(
            table.fields.map(field => [field.id, field])
        );

    }

}

module.exports = buildLookups;