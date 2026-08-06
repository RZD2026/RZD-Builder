const compileRegistry = require("../compileRegistry");

module.exports = {

    name: "CompileRegistry",

    description: "Compile registry",

    async execute(context) {

        context.build.registry =
            await compileRegistry(context.model);

    }

};
