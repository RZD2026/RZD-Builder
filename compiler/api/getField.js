function getField(table, fieldId) {

    if (!table) {
        return undefined;
    }

    if (!table.fieldLookup) {

        table.fieldLookup = Object.fromEntries(
            table.fields.map(field => [field.id, field])
        );

    }

    return table.fieldLookup[fieldId];

}

module.exports = getField;
