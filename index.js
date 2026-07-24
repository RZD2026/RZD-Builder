
require("dotenv").config();

const builder = require("./core/kernel/BuilderKernel");
const validator = require("./builders/validator");

const args = process.argv.slice(2);

const command = args[0];
const moduleName = args[1];
const dryRun = args.includes("--dry-run");

(async () => {

    try {

        switch (command) {

            case "build":

                if (!moduleName) {

                    console.log("");
                    console.log("Gebruik:");
                    console.log("");
                    console.log("node index.js build <module>");
                    console.log("node index.js build <module> --dry-run");
                    console.log("");

                    return;

                }

                await builder.buildModule(moduleName, {
                    dryRun
                });

                break;

            case "validate":

                await validator.validateModules(moduleName);

                break;

            default:

                console.log("");
                console.log("================================");
                console.log("RZD Builder v2.0");
                console.log("================================");
                console.log("");
                console.log("Beschikbare opdrachten:");
                console.log("");
                console.log("Build een module");
                console.log("  node index.js build <module>");
                console.log("");
                console.log("Build een module (dry-run)");
                console.log("  node index.js build <module> --dry-run");
                console.log("");
                console.log("Valideer alle modules");
                console.log("  node index.js validate");
                console.log("");
                console.log("Valideer één module");
                console.log("  node index.js validate <module>");
                console.log("");

        }

    } catch (error) {

        console.error("");
        console.error("================================");
        console.error("BUILDER ERROR");
        console.error("================================");
        console.error(error);
        console.error("");

        process.exit(1);

    }

})();