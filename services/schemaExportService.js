
const fs = require("fs");
const path = require("path");

class SchemaExportService {

    constructor() {

        this.outputFile = path.join(
            process.cwd(),
            "schemaChanges.json"
        );

    }

    save(changes) {

        fs.writeFileSync(

            this.outputFile,

            JSON.stringify(
                changes,
                null,
                4
            ),

            "utf8"

        );

        console.log("");
        console.log(`📄 Schema opgeslagen: ${this.outputFile}`);
        console.log("");

    }

    clear() {

        this.save([]);

    }

}

module.exports = new SchemaExportService();