class FieldDefinition {

    create(field = {}) {

        const airtableName =
            field.labels?.airtable ??
            field.name ??
            field.id ??
            "";

        return {

            // Identiteit
            id: field.id ?? null,

            order: field.order ?? 0,

            labels: {
                airtable: airtableName,
                app: field.labels?.app ?? airtableName,
                website: field.labels?.website ?? airtableName
            },

            // Backward compatibility
            name: airtableName,

            description: field.description ?? "",
            helpText: field.helpText ?? "",

            type: field.type,

            required: field.required ?? false,
            readonly: field.readonly ?? false,
            hidden: field.hidden ?? false,

            defaultValue:
                field.defaultValue ?? null,

            unit:
                field.unit ?? null,

            validation:
                field.validation ?? {},

            options:
                this.buildOptions(field)

        };

    }

    buildOptions(field) {

        // Builder v2
        if (
            field.options &&
            Object.keys(field.options).length > 0
        ) {

            return structuredClone(field.options);

        }

        const options = {};

        // Builder v1
        if (Array.isArray(field.choices)) {

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

            options.choices =
                field.listDefinition.values.map(value => ({
                    name: value
                }));

        }

        if (field.precision !== undefined) {
            options.precision = field.precision;
        }

        if (field.icon !== undefined) {
            options.icon = field.icon;
        }

        if (field.color !== undefined) {
            options.color = field.color;
        }

        return options;

    }

}

module.exports = new FieldDefinition();