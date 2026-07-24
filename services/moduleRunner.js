
const builder = require("../builders/builder");

async function run(build) {

    if (!build.modules || build.modules.length === 0) {

        console.log("Geen modules gevonden.");
        return;

    }

    for (const module of build.modules) {

        console.log("");
        console.log("================================");
        console.log(`Module: ${module.id}`);
        console.log("================================");

        await builder.buildModule(module.id);

    }

}

module.exports = {
    run
};