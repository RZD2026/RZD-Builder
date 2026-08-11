const loader = require("../services/contentModuleLoader");
const mapping = require("../content/mapping/rzd51PointMapping");

async function run() {

    const module = await loader.load("toegang");

    console.log("");
    console.log("===== RZD 5.1 POINT MAPPING DRY-RUN =====");
    console.log("");

    for (const point of module.points) {

        const result = mapping.get(point.id);
        const airtable = result?.airtable;

        console.log("--------------------------------");
        console.log(`Canon ID:        ${point.id}`);
        console.log(`Canon naam:      ${point.labels.website}`);
        console.log(`Type:             ${point.type}`);
        console.log(`Eenheid:          ${point.unit || "-"}`);
        console.log(`Status:           ${result?.status || "MISSING"}`);
        console.log(
            `Airtable module: ${airtable?.module || "-"}`
        );
        console.log(
            `Airtable naam:   ${airtable?.name || "-"}`
        );
    }

    const all = mapping.getAll();

    console.log("");
    console.log("===== SAMENVATTING =====");
    console.log(
        "EXACT:",
        all.filter(x => x.status === "EXACT").length
    );
    console.log(
        "POSSIBLE:",
        all.filter(x => x.status === "POSSIBLE").length
    );
    console.log(
        "NO_MATCH:",
        all.filter(x => x.status === "NO_MATCH").length
    );
    console.log("");

}

run().catch(error => {

    console.error("");
    console.error("===== MAPPING DRY-RUN MISLUKT =====");
    console.error("");
    console.error(error);
    process.exit(1);

});