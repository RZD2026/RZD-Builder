const airtable = require("./services/airtableAdapter");

(async () => {

    console.log("Stap 1");

    const table = await airtable.getTable("Accommodaties");

    console.log("Stap 2");

    const field = table.fields.find(
        f => f.name === "Naam"
    );

    console.log("Stap 3");

    console.dir(field, { depth: null });

    console.log("Stap 4");

})().catch(err => {

    console.error(err);

});


