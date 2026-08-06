
const fs = require("fs-extra");
const path = require("path");

async function writeCollection(outputDir, collection = [], property) {

    await fs.ensureDir(outputDir);

    for (const item of collection) {

        const filename = `${item.id}.js`;
        const filePath = path.join(outputDir, filename);

        const content =
`module.exports = ${JSON.stringify(item, null, 4)};
`;

        await fs.writeFile(filePath, content, "utf8");

        console.log(`✓ ${property}: ${filename}`);

    }

}

async function writeBuild(build) {

    const buildDir = path.join(__dirname, "..", "build");

    await fs.ensureDir(buildDir);

    await writeCollection(

        path.join(buildDir, "modules"),

        build.modules,

        "module"

    );

    await writeCollection(

        path.join(buildDir, "lists"),

        build.lists,

        "list"

    );

    await writeCollection(

        path.join(buildDir, "registry"),

        build.registry,

        "registry"

    );

    console.log("");
    console.log("Build succesvol geschreven.");
    console.log("");

}

module.exports = writeBuild;