
function getList(input, listId) {

    const context = input.lookup ? input : { lookup: input.lookup || {} };

    if (!context.lookup.lists) {
        return undefined;
    }

    return context.lookup.lists[listId];

}

module.exports = getList;