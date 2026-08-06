
function normalizeField(field, tableId) {

    return {

        tableId,

        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type,

        required: field.required ?? false,
        readonly: field.readonly ?? false,
        hidden: field.hidden ?? false,

        ...field

    };

}

function normalizeItem(item, mapper) {

    const data = item.data || {};

    return {

        file: item.file,
        path: item.path,

        ...mapper(data)

    };

}

async function createModel(input) {

    const canon = input.rawCanon || input;

    const model = {

        tables: (canon.tables || []).map(table =>
            normalizeItem(table, data => ({
                id: data.id,
                name: data.name,
                description: data.description,
                airtable: data.airtable,
                meta: data.meta,
                fields: (data.fields || []).map(field =>
                    normalizeField(field, data.id)
                )
            }))
        ),

        lists: (canon.lists || []).map(list =>
            normalizeItem(list, data => ({
                id: data.id,
                name: data.name,
                description: data.description,
                values: data.values || []
            }))
        ),

        registry: (canon.registry || []).map(registry =>
            normalizeItem(registry, data => ({
                id: data.id,
                name: data.name,
                version: data.version,
                author: data.author,
                description: data.description
            }))
        ),

        schema: canon.schema || [],
        validation: canon.validation || [],
        translations: canon.translations || [],

        warnings: []

    };

    return model;

}

module.exports = createModel;