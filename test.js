
const airtable = require("./services/airtableAdapter");

(async () => {
    try {

        const table = await airtable.getTable("Accommodaties");

        console.log("Tabel:", table.name);
        console.log("Aantal velden:", table.fields.length);
        console.log("");

        const names = table.fields.map(f => f.name);

        console.log(names);

        const field = table.fields.find(
            f => f.name === "Test checkbox"
        );

        console.log("");
        console.log("Resultaat:");
        console.dir(field, { depth: null });

    } catch (err) {
        console.error(err);
    }
})();