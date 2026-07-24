
const fs = require("fs-extra");
const path = require("path");

async function compileCanon(canon) {

    const outputDir = path.join(process.cwd(), "generated");

    await fs.ensureDir(outputDir);

    for (const table of canon.tables) {

        const fileName = table.id + ".js";

        const outputFile = path.join(outputDir, fileName);

        const code =
`/**
 * -------------------------------------------------------
 * AUTO GENERATED
 * Niet handmatig wijzigen.
 * Gegenereerd vanuit Canon.
 * -------------------------------------------------------
 */

module.exports = ${JSON.stringify(table, null, 4)};
`;

        await fs.writeFile(outputFile, code, "utf8");

        console.log("✓", fileName);

    }

}

module.exports = compileCanon;