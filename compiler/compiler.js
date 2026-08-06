
const CompilerPipeline = require("./CompilerPipeline");
const CompilerContext = require("./CompilerContext");

const CreateModelStage = require("./stages/CreateModelStage");
const EnrichModelStage = require("./stages/EnrichModelStage");
const DoctorStage = require("./stages/DoctorStage");
const CompileTablesStage = require("./stages/CompileTablesStage");
const CompileRegistryStage = require("./stages/CompileRegistryStage");
const CompileListsStage = require("./stages/CompileListsStage");

async function compiler(canon) {

    console.log("");
    console.log("Compileren...");
    console.log("");

    const context = new CompilerContext(canon);

    context.build = {

        modules: [],
        registry: [],
        lists: [],
        schema: [],
        translations: [],
        diagnostics: null

    };

    const pipeline = new CompilerPipeline();

    pipeline
        .add(CreateModelStage)
        .add(EnrichModelStage)
        .add(DoctorStage)
        .add(CompileTablesStage)
        .add(CompileRegistryStage)
        .add(CompileListsStage);

    await pipeline.execute(context);

    console.log("");
    console.log("Compiler gereed.");
    console.log("");

    return context.build;

}

module.exports = compiler;