
const builder = require("../core/kernel/BuilderKernel");

(async () => {

    try {

    await builder.buildModule("accommodations", {
        dryRun: true
    });

        console.log("");
        console.log("✓ ModuleRunner succesvol getest.");
        console.log("");

    } catch (err) {

        console.error(err);

    }

})();