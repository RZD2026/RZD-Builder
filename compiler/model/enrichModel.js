
const resolveReferences = require("./resolveReferences");
const buildStatistics = require("./buildStatistics");
const buildLookups = require("./buildLookups");
const validateModel = require("./validateModel");

async function enrichModel(model) {

    model.lookup = {};
    model.errors = [];
    model.warnings = model.warnings || [];

    buildLookups(model);
    await resolveReferences(model);
    await validateModel(model);
    buildStatistics(model);

    return model;

}

module.exports = enrichModel;