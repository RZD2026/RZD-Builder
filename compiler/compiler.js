
const compileTables = require("./compileTables");
const compileLists = require("./compileLists");
const compileRegistry = require("./compileRegistry");

async function compiler(canon) {

    console.log("");
    console.log("Compileren...");
    console.log("");

    const build = {

        modules: [],
        registry: [],
        lists: [],
        schema: [],
        translations: []

    };

    build.modules = await compileTables(canon);
    build.registry = await compileRegistry(canon);
    build.lists = await compileLists(canon);

    console.log("");
    console.log("Compiler gereed.");
    console.log("");

    return build;

}

module.exports = compiler;