
const fs = require("fs-extra");
const path = require("path");

async function write(file, content) {
    const filePath = path.join(process.cwd(), file);

    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, "utf8");

    console.log("✓", file);
}

async function main() {

    console.log("");
    console.log("====================================");
    console.log("RZD Builder - Canon Initializer");
    console.log("====================================");
    console.log("");

    await write(
        "canon/registry/project.yaml",
`project:
  id: rzd
  name: Reizen zonder Drempels
  version: "2.0.0"

defaults:
  language: nl
  database: airtable
`
    );

    await write(
        "canon/lists/accommodation-types.yaml",
`meta:
  id: ACC-L001
  version: "1.0.0"
  status: active

id: accommodation-types

name:
  nl: Type accommodatie
  en: Accommodation type

values:
  - Camping
  - Hotel
  - Appartement
  - Vakantiepark
  - Camperplaats
  - B&B
`
    );

    await write(
        "canon/tables/accommodaties.yaml",
`meta:
  id: ACC-T001
  version: "1.0.0"
  status: active

table:
  id: accommodations
  airtable: Accommodaties

fields:

  - id: ACC-F001
    name: Naam
    type: TEXT

  - id: ACC-F002
    name: Type accommodatie
    type: SINGLESELECT
    list: accommodation-types

  - id: ACC-F003
    name: Land
    type: TEXT

  - id: ACC-F004
    name: Regio
    type: TEXT

  - id: ACC-F005
    name: Plaats
    type: TEXT

  - id: ACC-F006
    name: Adres
    type: TEXT
`
    );

    console.log("");
    console.log("Canon succesvol aangemaakt.");
    console.log("");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});