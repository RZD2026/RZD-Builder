
const fs = require("fs");
const path = require("path");

class Logger {

    constructor() {

        this.logsFolder = path.join(__dirname, "..", "logs");

        if (!fs.existsSync(this.logsFolder)) {
            fs.mkdirSync(this.logsFolder, { recursive: true });
        }

    }

    getLogFile(moduleName) {

        const now = new Date();

        const timestamp =
            now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0") + "_" +
            String(now.getHours()).padStart(2, "0") + "-" +
            String(now.getMinutes()).padStart(2, "0") + "-" +
            String(now.getSeconds()).padStart(2, "0");

        return path.join(
            this.logsFolder,
            `${timestamp}-${moduleName}.log`
        );

    }

    start(moduleName) {

        this.file = this.getLogFile(moduleName);

        this.write("================================");
        this.write("RZD Builder");
        this.write("================================");
        this.write(`Module : ${moduleName}`);
        this.write(`Datum  : ${new Date().toLocaleString()}`);
        this.write("");

    }

    write(text = "") {

        fs.appendFileSync(
            this.file,
            text + "\n",
            "utf8"
        );

    }

    end(created, skipped) {

        this.write("");
        this.write("================================");
        this.write("Resultaat");
        this.write("================================");
        this.write(`Aangemaakt : ${created}`);
        this.write(`Overgeslagen : ${skipped}`);

    }

}

module.exports = new Logger();