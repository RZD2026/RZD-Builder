
const mapFieldType = require("./typeMapper");

async function compileTables(canon) {

    const modules = [];

    for (const table of canon.tables) {

        modules.push({

            id: table.id,

            name: table.name,

            description: table.description,

            airtable: table.airtable,

            meta: table.meta,

            fields: (table.fields || []).map(field => ({

                ...field,

                type: mapFieldType(field.type)

            }))

        });

    }

    return modules;

}

module.exports = compileTables;