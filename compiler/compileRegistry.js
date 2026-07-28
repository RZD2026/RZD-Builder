
async function compileRegistry(input) {

    const model = input.model || input;

    return model.registry || [];

}

module.exports = compileRegistry;