
const loadCanon = require("../compiler/loadCanon");
const validateCanon = require("../compiler/validateCanon");

async function main() {

    console.log("");
    console.log("====================================");
    console.log("RZD Canon Loader Test");
    console.log("====================================");
    console.log("");

    const canon = await loadCanon();

    console.log("Registry :", canon.registry.length);
    console.log("Lists    :", canon.lists.length);
    console.log("Tables   :", canon.tables.length);
    console.log("");

    console.log("Registry bestanden:");
    canon.registry.forEach(item => {
        console.log(" -", item.file);
    });

    console.log("");

    console.log("Lijsten:");
    canon.lists.forEach(item => {
        console.log(" -", item.file);
    });

    console.log("");

    console.log("Tabellen:");
    canon.tables.forEach(item => {
        console.log(" -", item.file);
    });

    console.log("");

    const errors = validateCanon(canon);

    if (errors.length === 0) {
        console.log("✓ Canon succesvol geladen.");
        console.log("✓ Canon validatie succesvol.");
    } else {
        console.log("Fouten gevonden:");
        errors.forEach(error => {
            console.log(" -", error);
        });
    }

    console.log("");

}

main().catch(err => {
    console.error(err);
    process.exit(1);
});