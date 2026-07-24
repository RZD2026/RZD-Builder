
const fs = require("fs-extra");
const path = require("path");
const YAML = require("yaml");

async function loadDirectory(dir) {

    const result = [];

    if (!(await fs.pathExists(dir))) {
        return result;
    }

    const files = await fs.readdir(dir);

    for (const file of files) {

        if (!file.endsWith(".yaml")) {
            continue;
        }

        const fullPath = path.join(dir, file);
        const text = await fs.readFile(fullPath, "utf8");

        result.push({
            file,
            path: fullPath,
            data: YAML.parse(text)
        });

    }

    return result;

}

async function loadCanon() {

    const canonRoot = path.join(process.cwd(), "canon");

    return {

        registry: await loadDirectory(path.join(canonRoot, "registry")),
        lists: await loadDirectory(path.join(canonRoot, "lists")),
        tables: await loadDirectory(path.join(canonRoot, "tables"))

    };

}

module.exports = loadCanon;