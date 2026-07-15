
const airtable = require("./services/airtableAdapter");

(async () => {
    try {
        const table = await airtable.getTable("Accommodaties");

        const field = table.fields.find(
            f => f.name === "Test Checkbox"
        );

        console.dir(field, { depth: null });

    } catch (err) {
        console.error(err);
    }
})();
