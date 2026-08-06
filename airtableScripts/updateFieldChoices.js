
'use strict';

/*
 * Airtable Script
 * Wordt aangeroepen door de MCP-engine.
 *
 * Verwacht:
 * {
 *   tableName: "...",
 *   fieldName: "...",
 *   choices: [
 *     {
 *       name: "...",
 *       color: "blueBright"
 *     }
 *   ]
 * }
 */

async function main() {

    const inputConfig = input.config();

    const {
        tableName,
        fieldName,
        choices
    } = inputConfig;

    if (!tableName) {
        throw new Error("tableName ontbreekt.");
    }

    if (!fieldName) {
        throw new Error("fieldName ontbreekt.");
    }

    if (!Array.isArray(choices)) {
        throw new Error("choices moet een array zijn.");
    }

    const table = base.getTable(tableName);

    if (!table) {
        throw new Error(`Tabel '${tableName}' niet gevonden.`);
    }

    const field = table.getField(fieldName);

    if (!field) {
        throw new Error(`Veld '${fieldName}' niet gevonden.`);
    }

    await field.updateOptionsAsync({
        choices
    });

    output.set("success", true);

}

await main();