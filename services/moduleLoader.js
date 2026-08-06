
const fs = require("fs");
const path = require("path");

async function load(moduleName) {

    const locations = [

        path.join(__dirname, "..", "build", "modules", `${moduleName}.js`),
        path.join(__dirname, "..", "modules", `${moduleName}.js`)

    ];

    for (const file of locations) {

        if (fs.existsSync(file)) {

            delete require.cache[require.resolve(file)];

            return require(file);

        }

    }

    throw new Error(`Module '${moduleName}' niet gevonden.`);

}

module.exports = {
    load
};