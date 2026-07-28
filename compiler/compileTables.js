
async function compileTables(input) {

    const model = input.model || input;

    return model.tables.map(table => ({

        id: table.id,
        name: table.name,
        description: table.description,
        airtable: table.airtable,
        meta: table.meta,

        fields: table.fields.map(field => ({

            ...field,

            list: field.hasList
                ? field.listRef.id
                : field.list

        }))

    }));

}

module.exports = compileTables;