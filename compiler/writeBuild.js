
const fs = require("fs-extra");
const path = require("path");

async function writeBuild(build) {

    const buildDir = path.join(__dirname, "..", "build");
    const modulesDir = path.join(buildDir, "modules");

    await fs.ensureDir(buildDir);
    await fs.ensureDir(modulesDir);

    for (const module of build.modules) {

        const filename = `${module.id}.js`;
        const filePath = path.join(modulesDir, filename);

        const content =
`module.exports = ${JSON.stringify(module, null, 4)};
`;

        await fs.writeFile(filePath, content, "utf8");

        console.log(`✓ ${filename}`);

    }

    console.log("");
    console.log("Build succesvol geschreven.");
    console.log("");

}

module.exports = writeBuild;