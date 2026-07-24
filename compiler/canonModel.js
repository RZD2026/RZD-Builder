
function canonModel(rawCanon) {

    const lists = rawCanon.lists.map(item => item.data);

    return {

        registry: rawCanon.registry.map(item => item.data),

        lists,

        tables: rawCanon.tables.map(item => ({

            source: item.file,

            id: item.data.table.id,

            airtable: item.data.table.airtable,

            meta: item.data.meta || {},

            name: item.data.meta?.name || "",

            description: item.data.meta?.description || "",

            fields: (item.data.fields || []).map(field => ({

                ...field,

                listDefinition: field.list
                    ? lists.find(list => list.id === field.list) || null
                    : null

            }))

        }))

    };

}

module.exports = canonModel;