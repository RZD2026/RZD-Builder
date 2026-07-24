
function normalizeCanon(canon) {

    return {

        registry: canon.registry,

        lists: canon.lists,

        tables: (canon.tables || []).map(table => ({

            id: table.table.id,

            airtable: table.table.airtable,

            meta: table.meta || {},

            fields: table.fields || []

        }))

    };

}

module.exports = normalizeCanon;