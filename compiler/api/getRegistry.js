
function getRegistry(model, id) {

    if (!model || !model.registry) {
        return undefined;
    }

    return model.registry.find(entry => entry.id === id);

}

module.exports = getRegistry;