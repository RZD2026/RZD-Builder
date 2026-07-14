
const { testConnection } = require("./services/airtable");

(async () => {
    await testConnection();
})();