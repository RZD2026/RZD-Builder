const compileLists = require("../compileLists");

module.exports = {

    name: "CompileLists",

    description: "Compile lists",

    async execute(context) {

        context.build.lists =
            await compileLists(context.model);

    }

};
