
function normalizeCanon(canon) {

    return {

    registry: canon.registry,

    lists: canon.lists,

    tables: (canon.tables || []).map(table => ({

        id: table.data.table.id,

        airtable: table.data.table.airtable,

        meta: table.data.meta || {},

        fields: table.data.fields || []

    }))

};

    };

}

module.exports = normalizeCanon;