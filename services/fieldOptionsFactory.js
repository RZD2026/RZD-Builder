
class FieldOptionsFactory {

    static get(field) {

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
                        `SingleSelect '${field.name}' heeft geen choices.`
                    );
                }

                return {
                    choices: choices.map(choice => ({
                        name: typeof choice === "string"
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
                        `MultiSelect '${field.name}' heeft geen choices.`
                    );
                }

                return {
                    choices: choices.map(choice => ({
                        name: typeof choice === "string"
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
                return null;

            case "date":
                return {
                    dateFormat: {
                        name: "local"
                    }
                };

            default:
                return null;

        }

    }

}

module.exports = FieldOptionsFactory;