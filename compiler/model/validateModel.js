
async function validateModel(input) {

    const model = input.model || input;

    for (const table of model.tables) {

        for (const field of table.fields) {

            if (!field.id) {

                model.warnings.push({
                    type: "missing-field-id",
                    table: table.id,
                    field: field.name || "<unknown>"
                });

            }

        }

    }

    return model;

}

module.exports = validateModel;