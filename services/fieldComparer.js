class FieldComparer {

    compare(localField, airtableField) {

        const differences = [];

        // Naam (Builder v2 gebruikt labels.airtable)
        const localName =
            localField.labels?.airtable ??
            localField.name ??
            "";

        if (localName !== (airtableField.name || "")) {
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

        // Builder v2
        if (Array.isArray(options.choices)) {

            options.choices = options.choices.map(choice => ({

                name:
                    typeof choice === "string"
                        ? choice
                        : choice.name

            }));

        }

        // Builder v1 (backward compatibility)
        else if (Array.isArray(field.choices)) {

            options.choices = field.choices.map(choice => ({

                name:
                    typeof choice === "string"
                        ? choice
                        : choice.name

            }));

        }

        // Canon
        else if (
            field.listDefinition &&
            Array.isArray(field.listDefinition.values)
        ) {

            options.choices = field.listDefinition.values.map(value => ({
                name: value
            }));

        }

        return options;

    }

    normalizeChoices(choices = []) {

        return choices
            .map(choice => choice.name)
            .filter(Boolean)
            .sort();

    }

    compareOptions(localOptions, airtableOptions, differences) {

        if (
            (localOptions.precision ?? null) !==
            (airtableOptions.precision ?? null)
        ) {
            differences.push("options.precision");
        }

        if (
            (localOptions.icon || "") !==
            (airtableOptions.icon || "")
        ) {
            differences.push("options.icon");
        }

        if (
            (localOptions.color || "") !==
            (airtableOptions.color || "")
        ) {
            differences.push("options.color");
        }

        const localChoices =
            this.normalizeChoices(localOptions.choices);

        const airtableChoices =
            this.normalizeChoices(airtableOptions.choices);

        if (
            JSON.stringify(localChoices) !==
            JSON.stringify(airtableChoices)
        ) {
            differences.push("options.choices");
        }

    }

}

module.exports = new FieldComparer();