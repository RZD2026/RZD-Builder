class FieldOptionsFactory {

    static get(field) {

        // Builder v2:
        // Heeft het veld zelf al options?
        // Dan zijn die leidend.
        if (
            field.options &&
            Object.keys(field.options).length > 0
        ) {
            return field.options;
        }

        switch (field.type) {

            case "checkbox":
                return {
                    icon: "check",
                    color: "greenBright"
                };

            case "number":
                return {
                    precision: 1
                };

            case "singleSelect": {

                const choices =
                    field.choices ||
                    field.listDefinition?.values;

                if (!choices || choices.length === 0) {

                    throw new Error(
                        `SingleSelect '${field.labels?.airtable || field.name}' heeft geen choices.`
                    );

                }

                return {
                    choices: choices.map(choice => ({
                        name:
                            typeof choice === "string"
                                ? choice
                                : choice.name
                    }))
                };

            }

            case "multipleSelect": {

                const choices =
                    field.choices ||
                    field.listDefinition?.values;

                if (!choices || choices.length === 0) {

                    throw new Error(
                        `MultiSelect '${field.labels?.airtable || field.name}' heeft geen choices.`
                    );

                }

                return {
                    choices: choices.map(choice => ({
                        name:
                            typeof choice === "string"
                                ? choice
                                : choice.name
                    }))
                };

            }

            case "singleLineText":
            case "multilineText":
            case "url":
            case "email":
            case "phoneNumber":
                return {};

            case "date":
                return {
                    dateFormat: {
                        name: "local"
                    }
                };

            default:
                return {};

        }

    }

}

module.exports = FieldOptionsFactory;