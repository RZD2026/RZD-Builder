
const resolveReferences = require("./resolveReferences");
const buildStatistics = require("./buildStatistics");
const buildLookups = require("./buildLookups");
const validateModel = require("./validateModel");

async function enrichModel(input) {

    const context = input.model ? input : { model: input };
    const model = context.model;

    context.lookup = {};
    context.errors = [];
    context.warnings = context.warnings || [];
    context.statistics = {};

    buildLookups(context);
    await resolveReferences(context);
    await validateModel(context);
    buildStatistics(context);

    return model;

}

module.exports = enrichModel;
