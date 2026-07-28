
function getList(model, listId) {

    if (!model || !model.lookup || !model.lookup.lists) {
        return undefined;
    }

    return model.lookup.lists[listId];

}

module.exports = getList;