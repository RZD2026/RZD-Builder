const loader = require("../services/contentModuleLoader");
const mapping = require("../content/mapping/rzd51PointMapping");
const resolver = require("../content/mapping/airtablePointResolver");

async function run() {

    const module = await loader.load("toegang");

    console.log("");
    console.log("===== RZD 5.1 COMBINED POINT MAPPING DRY-RUN =====");
    console.log("");

    const results = [];

    for (const point of module.points) {

        const pointMapping = mapping.get(point.id);
        const resolved = await resolver.resolve(pointMapping);

        results.push({
            id: point.id,
            mapping: pointMapping?.status || "MISSING",
            resolver: resolved.status,
            module: pointMapping?.airtable?.module || "-",
            name: pointMapping?.airtable?.name || "-",
            recordId: resolved.recordId || "-"
        });
    }

    console.log("ID | MAPPING | RESOLVER | MODULE | RZD PUNT | AIRTABLE RECORD");
    console.log("--------------------------------------------------------------------------------");

    for (const result of results) {
        console.log(JSON.stringify(result));
    }

    const exact = results.filter(
        x => x.mapping === "EXACT"
    ).length;

    const possible = results.filter(
        x => x.mapping === "POSSIBLE"
    ).length;

    const noMatch = results.filter(
        x => x.mapping === "NO_MATCH"
    ).length;

    const found = results.filter(
        x => x.recordId !== "-"
    ).length;

    console.log("");
    console.log("===== SAMENVATTING =====");
    console.log(`Canon punten:      ${results.length}`);
    console.log(`EXACT mappings:    ${exact}`);
    console.log(`POSSIBLE mappings: ${possible}`);
    console.log(`NO_MATCH mappings: ${noMatch}`);
    console.log(`Records gevonden:  ${found}`);
    console.log("");
    console.log("Airtable writes: 0");
    console.log("");

    if (results.length === 10) {
        console.log("===== COMBINED DRY-RUN GESLAAGD =====");
    } else {
        console.log("===== COMBINED DRY-RUN ONVOLLEDIG =====");
    }

    console.log("");
}

run().catch(error => {

    console.error("");
    console.error("===== COMBINED DRY-RUN MISLUKT =====");
    console.error("");
    console.error(error);
    process.exit(1);

});
