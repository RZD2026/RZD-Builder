const fs = require("fs");
const path = require("path");

const contentEngine = require("../content/contentEngine");

class ContentModuleLoader {

    async load(moduleName) {

        if (
            typeof moduleName !== "string" ||
            moduleName.trim() === ""
        ) {
            throw new Error(
                "ContentModuleLoader: module naam ontbreekt."
            );
        }

        const file = path.join(
            __dirname,
            "..",
            "content",
            "modules",
            `${moduleName}.js`
        );

        if (!fs.existsSync(file)) {
            throw new Error(
                `Content module '${moduleName}' niet gevonden.`
            );
        }

        delete require.cache[require.resolve(file)];

        const module = require(file);

        return contentEngine.buildModule(module);
    }

}

module.exports = new ContentModuleLoader();