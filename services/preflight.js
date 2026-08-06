
const fs = require("fs");
const path = require("path");

const version = require("../version");
const healthCheck = require("./healthCheck");

class Preflight {

    run() {

        const health = healthCheck.check();

        return {

            version,

            node: process.version,

            environment: fs.existsSync(
                path.join(process.cwd(), ".env")
            ),

            health

        };

    }

    print(result) {

        console.log("");
        console.log("================================");
        console.log("Preflight Check");
        console.log("================================");
        console.log("");

        console.log(`Builder     : ${result.version.name}`);
        console.log(`Versie      : ${result.version.version}`);
        console.log(`Node        : ${result.node}`);
        console.log(`.env        : ${result.environment ? "OK" : "ONTBREEKT"}`);

        console.log("");

        healthCheck.print(result.health);

    }

}

module.exports = new Preflight();