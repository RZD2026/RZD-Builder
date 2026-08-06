
async function validateModel(input) {

    const context = input.model ? input : { model: input };
    const model = context.model;

    for (const table of model.tables) {

        for (const field of table.fields) {

            if (!field.id) {

                context.warnings.push({
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