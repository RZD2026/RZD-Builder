function getTable(input, tableId) {

    const context = input.lookup ? input : { lookup: input.lookup || {} };

    if (!context.lookup.tables) {
        return undefined;
    }

    return context.lookup.tables[tableId];

}

module.exports = getTable;
