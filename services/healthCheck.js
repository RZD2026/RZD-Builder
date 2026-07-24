
const fs = require("fs");
const path = require("path");

class HealthCheck {

    check() {

        const result = {

            reports: false,
            logs: false,
            backup: false,
            modules: false,
            services: false

        };

        result.reports =
            fs.existsSync(
                path.join(process.cwd(), "reports")
            );

        result.logs =
            fs.existsSync(
                path.join(process.cwd(), "logs")
            );

        result.backup =
            fs.existsSync(
                path.join(process.cwd(), "backup")
            );

        result.modules =
            fs.existsSync(
                path.join(process.cwd(), "modules")
            );

        result.services =
            fs.existsSync(
                path.join(process.cwd(), "services")
            );

        return result;

    }

    print(result) {

        console.log("");
        console.log("================================");
        console.log("Health Check");
        console.log("================================");
        console.log("");

        console.log(
            `Reports  : ${result.reports ? "OK" : "ONTBREEKT"}`
        );

        console.log(
            `Logs     : ${result.logs ? "OK" : "ONTBREEKT"}`
        );

        console.log(
            `Backup   : ${result.backup ? "OK" : "ONTBREEKT"}`
        );

        console.log(
            `Modules  : ${result.modules ? "OK" : "ONTBREEKT"}`
        );

        console.log(
            `Services : ${result.services ? "OK" : "ONTBREEKT"}`
        );

        console.log("");

    }

}

module.exports = new HealthCheck();