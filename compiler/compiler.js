
const CompilerContext = require("./CompilerContext");

const createModel = require("./model/createModel");
const enrichModel = require("./model/enrichModel");

const doctor = require("./doctor/doctor");

const compileTables = require("./compileTables");
const compileLists = require("./compileLists");
const compileRegistry = require("./compileRegistry");

async function compiler(canon) {

    console.log("");
    console.log("Compileren...");
    console.log("");

    const context = new CompilerContext(canon);

    context.model = await createModel(context);
    await enrichModel(context);

    const diagnostics = await doctor(context.model);

    const build = {

        modules: [],
        registry: [],
        lists: [],
        schema: [],
        translations: [],

        diagnostics

    };

    build.modules = await compileTables(context.model);
    build.registry = await compileRegistry(context.model);
    build.lists = await compileLists(context.model);

    console.log("");
    console.log("Compiler gereed.");
    console.log("");

    return build;

}

module.exports = compiler;