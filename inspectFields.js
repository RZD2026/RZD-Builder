
const airtable = require("./services/airtableAdapter");

(async () => {

    const fields = await airtable.getFields("Accommodaties");

    console.dir(fields[0], { depth: null });

})();