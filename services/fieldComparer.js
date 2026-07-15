
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

        // Options
        this.compareOptions(
            localField.options || {},
            airtableField.options || {},
            differences
        );

        return differences;

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