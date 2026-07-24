
const canonModel = require("../compiler/canonModel");

const loadCanon = require("../compiler/loadCanon");
const validateCanon = require("../compiler/validateCanon");
const compiler = require("../compiler/compiler");
const writeBuild = require("../compiler/writeBuild");

async function buildPipeline() {

    console.log("");
    console.log("====================================");
    console.log("RZD Canon Build Pipeline");
    console.log("====================================");
    console.log("");

    const rawCanon = await loadCanon();
    const canon = canonModel(rawCanon);

    // 2. Canon valideren
    const errors = await validateCanon(canon);

    if (errors.length > 0) {

        console.log("");
        console.log("Canon bevat fouten:");
        console.log("");

        errors.forEach(error => {
            console.log(" - " + error);
        });

        console.log("");
        throw new Error("Canon validatie mislukt.");

    }

    console.log("✓ Canon gevalideerd");

    // 3. Compileren
    const build = await compiler(canon);

    // 4. Wegschrijven
    await writeBuild(build);

    console.log("");
    console.log("✓ Pipeline succesvol afgerond.");
    console.log("");

    return build;

}

module.exports = buildPipeline;