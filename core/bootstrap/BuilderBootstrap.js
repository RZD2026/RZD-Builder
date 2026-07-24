const moduleLoader = require("../../services/moduleLoader");
const logger = require("../../services/logger");
const schemaValidator = require("../../services/schemaValidator");
const airtable = require("../../services/airtableAdapter");
const auditService = require("../../services/auditService");

const BuilderContext = require("../../services/builderContext");

class BuilderBootstrap {

    static async create(moduleName, options = {}) {

        logger.start(moduleName);

        auditService.clear();

        let module;

        try {

            module = await moduleLoader.load(moduleName);

        } catch (err) {

            console.log(`❌ Module '${moduleName}' niet gevonden.`);
            logger.write(`FOUT: Module '${moduleName}' niet gevonden.`);

            return null;

        }

        const errors = schemaValidator.validate(module);

        if (errors.length > 0) {

            console.log("");
            console.log("================================");
            console.log("SCHEMA VALIDATIE FOUTEN");
            console.log("================================");
            console.log("");

            logger.write("SCHEMA VALIDATIE FOUTEN");

            errors.forEach(error => {

                console.log("❌ " + error);
                logger.write(error);

            });

            console.log("");
            console.log("Builder gestopt.");
            console.log("");

            logger.write("Builder gestopt.");

            return null;

        }

        const tableName = module.table || "Accommodaties";

        const airtableFields =
            await airtable.getFields(tableName);

        const context = new BuilderContext({

            module,
            tableName,
            airtableFields,
            logger,
            options

        });

        return {

    moduleName,
    module,
    tableName,
    context

};

    }

}

module.exports = BuilderBootstrap;