
function findField(model, fieldId) {

    if (!model || !model.tables) {
        return undefined;
    }

    for (const table of model.tables) {

        const field = table.fields.find(field => field.id === fieldId);

        if (field) {

            return {
                table,
                field
            };

        }

    }

    return undefined;

}

module.exports = findField;