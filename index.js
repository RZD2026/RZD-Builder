
require("dotenv").config({ quiet: true });

const args = process.argv.slice(2);

const command = args[0];
const moduleName = args[1];
const dryRun = args.includes("--dry-run");

(async () => {

    try {

        switch (command) {

            case "mcp": {

                const Protocol =
                    require("./mcp/protocol");

                const router =
                    require("./mcp/router");

                const protocol = new Protocol();

                protocol.onRequest(async request => {

                    const requestId =
                        request?.id ?? null;

                    try {

                        const result =
                            await router.handle(request);

                        if (request?.id !== undefined) {
                            protocol.reply(
                                requestId,
                                result ?? null
                            );
                        }

                    } catch (error) {

                        protocol.error(
                            requestId,
                            error instanceof Error
                                ? error.message
                                : String(error)
                        );

                    }

                });

                protocol.listen();

                break;

            }

            case "build": {

                if (!moduleName) {

                    console.log("");
                    console.log("Gebruik:");
                    console.log("");
                    console.log("node index.js build <module>");
                    console.log("node index.js build <module> --dry-run");
                    console.log("");

                    return;

                }

                const builder =
                    require("./core/kernel/BuilderKernel");

                const mcpService =
                    require("./services/mcpService");

                try {

                    await builder.buildModule(moduleName, {
                        dryRun
                    });

                } finally {

                    await mcpService.disconnect();

                }

                break;

            }

            case "validate": {

                const validator =
                    require("./builders/validator");

                await validator.validateModules(moduleName);

                break;

            }

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