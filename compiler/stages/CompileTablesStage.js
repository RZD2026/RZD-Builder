const compileTables = require("../compileTables");

module.exports = {

    name: "CompileTables",

    description: "Compile table definitions",

    async execute(context) {

        context.build.modules =
            await compileTables(context.model);

    }

};
