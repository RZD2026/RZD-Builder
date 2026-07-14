
require("dotenv").config();

const { testConnection } = require("./services/airtable");
const { readSchema } = require("./services/schema");
const { buildModule } = require("./builders/builder");
const { testPermissions } = require("./services/permission-test");

async function main() {

    const command = process.argv[2];

    switch (command) {

        case "test":
            await testConnection();
            break;

        case "schema":
            await readSchema();
            break;

        case "permissions":
            await testPermissions();
            break;

        case "build":
            await buildModule(process.argv[3]);
            break;

        default:

            console.log("");
            console.log("================================");
            console.log("RZD Builder v1.0");
            console.log("================================");
            console.log("");
            console.log("Beschikbare opdrachten:");
            console.log("");
            console.log("node index.js test");
            console.log("node index.js schema");
            console.log("node index.js permissions");
            console.log("node index.js build toegang");
            console.log("");

            break;
    }

}

main().catch(error => {
    console.error(error);
});