
const buildPipeline = require("../services/buildPipeline");

(async () => {

    try {

        await buildPipeline();

        console.log("");
        console.log("====================================");
        console.log("✓ RZD Build Pipeline succesvol");
        console.log("====================================");
        console.log("");

    } catch (error) {

        console.error("");
        console.error("====================================");
        console.error("✗ Pipeline mislukt");
        console.error("====================================");
        console.error("");
        console.error(error.message);
        console.error("");

        process.exit(1);

    }

})();