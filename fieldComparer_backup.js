
class FieldComparer {

    compare(localField, airtableField) {

        const differences = [];

        // Naam
        if ((localField.name || "") !== (airtableField.name || "")) {
            differences.push("name");
        }

        // Type
        if ((localField.type || "") !== (airtableField.type || "")) {
            differences.push("type");
        }

        // Description
        if (
            (localField.description || "") !==
            (airtableField.description || "")
        ) {
            differences.push("description");
        }

        // Bouw options vanuit Canon indien nodig
        const localOptions = this.buildOptions(localField);

        this.compareOptions(
            localOptions,
            airtableField.options || {},
            differences
        );

        return differences;

    }

    buildOptions(field) {

        const options = { ...(field.options || {}) };

        if (
            field.type === "SINGLESELECT" &&
            field.listDefinition &&
            Array.isArray(field.listDefinition.values)
        ) {
            options.choices = field.listDefinition.values.map(value => ({
                name: value
            }));
        }

        return options;

    }

    compareOptions(localOptions, airtableOptions, differences) {

        // Precision
        if (
            (localOptions.precision ?? null) !==
            (airtableOptions.precision ?? null)
        ) {
            differences.push("options.precision");
        }

        // Checkbox icon
        if (
            (localOptions.icon || "") !==
            (airtableOptions.icon || "")
        ) {
            differences.push("options.icon");
        }

        // Checkbox kleur
        if (
            (localOptions.color || "") !==
            (airtableOptions.color || "")
        ) {
            differences.push("options.color");
        }

        // Select keuzes
        const localChoices = JSON.stringify(localOptions.choices || []);
        const airtableChoices = JSON.stringify(airtableOptions.choices || []);

        if (localChoices !== airtableChoices) {
            differences.push("options.choices");
        }

    }

}

module.exports = new FieldComparer();