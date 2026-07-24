
const loadCanon = require("../compiler/loadCanon");
const canonModel = require("../compiler/canonModel");
const validateCanon = require("../compiler/validateCanon");
const compileCanon = require("../compiler/compileCanon");

async function main() {

    console.log("");
    console.log("======================================");
    console.log("RZD Canon Compiler Test");
    console.log("======================================");
    console.log("");

    const rawCanon = await loadCanon();
    const canon = canonModel(rawCanon);

    const errors = validateCanon(canon);

    if (errors.length) {

        console.log("Validatiefouten:");

        errors.forEach(e => console.log(" -", e));

        process.exit(1);

    }

    await compileCanon(canon);

    console.log("");
    console.log("✓ Compiler succesvol uitgevoerd.");
    console.log("");

}

main().catch(err => {
    console.error(err);
    process.exit(1);
});