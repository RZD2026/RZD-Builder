
const loadCanon = require("../compiler/loadCanon");
const canonModel = require("../compiler/canonModel");
const validateCanon = require("../compiler/validateCanon");

async function main() {

    console.log("");
    console.log("======================================");
    console.log("RZD Canon Validation Test");
    console.log("======================================");
    console.log("");

    const rawCanon = await loadCanon();
    const canon = canonModel(rawCanon);

    const errors = validateCanon(canon);

    if (errors.length === 0) {

        console.log("✓ Registry :", canon.registry.length);
        console.log("✓ Lists    :", canon.lists.length);
        console.log("✓ Tables   :", canon.tables.length);
        console.log("");
        console.log("✓ Canon validatie succesvol.");
        console.log("");

    } else {

        console.log("Validatiefouten:");
        console.log("");

        errors.forEach(error => {
            console.log(" -", error);
        });

        process.exit(1);

    }

}

main().catch(err => {
    console.error(err);
    process.exit(1);
});