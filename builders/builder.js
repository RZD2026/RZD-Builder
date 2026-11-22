
const builderKernel = require("../core/kernel/BuilderKernel");


async function buildModule(moduleName, options = {}) {

    return builderKernel.buildModule(
        moduleName,
        options
    );

}

module.exports = {
    buildModule
};