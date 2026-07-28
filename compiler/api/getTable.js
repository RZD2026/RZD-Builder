function getTable(model, tableId) {

    if (!model || !model.lookup || !model.lookup.tables) {
        return undefined;
    }

    return model.lookup.tables[tableId];

}

module.exports = getTable;
