
function validateCanon(canon) {

    const errors = [];

    if (!canon.registry || canon.registry.length === 0) {
        errors.push("Geen registry gevonden.");
    }

    if (!canon.tables || canon.tables.length === 0) {
        errors.push("Geen tabellen gevonden.");
    }

    if (!canon.lists || canon.lists.length === 0) {
        errors.push("Geen lijsten gevonden.");
    }

    const fieldIds = new Set();

    for (const table of canon.tables) {

        if (!table.id) {
            errors.push(`${table.source}: table.id ontbreekt.`);
        }

        if (!table.airtable) {
            errors.push(`${table.source}: table.airtable ontbreekt.`);
        }

        if (!Array.isArray(table.fields)) {
            errors.push(`${table.source}: fields ontbreekt.`);
            continue;
        }

        for (const field of table.fields) {

            if (!field.id)
                errors.push(`${table.source}: veld zonder id.`);

            if (!field.name)
                errors.push(`${table.source}: veld zonder naam.`);

            if (!field.type)
                errors.push(`${table.source}: ${field.name || field.id} heeft geen type.`);

            if (field.id) {

                if (fieldIds.has(field.id)) {
                    errors.push(`${table.source}: dubbele field id ${field.id}`);
                }

                fieldIds.add(field.id);

            }

        }

    }

    return errors;

}

module.exports = validateCanon;