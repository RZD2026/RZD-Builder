
const compileTables = require("./compileTables");

async function compiler(canon) {

    console.log("");
    console.log("Compileren...");
    console.log("");

    const build = {
        modules: [],
        lists: canon.lists || [],
        schema: [],
        translations: []
    };

    build.modules = await compileTables(canon);

    console.log("");
    console.log("Compiler gereed.");
    console.log("");

    return build;

}

module.exports = compiler;