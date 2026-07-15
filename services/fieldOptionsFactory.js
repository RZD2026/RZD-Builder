
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

            case "singleSelect":

                if (!field.choices || field.choices.length === 0) {
                    throw new Error(
                        `SingleSelect '${field.name}' heeft geen choices.`
                    );
                }

                return {
                    choices: field.choices.map(choice => ({
                        name: choice
                    }))
                };

            case "multipleSelect":

                if (!field.choices || field.choices.length === 0) {
                    throw new Error(
                        `MultiSelect '${field.name}' heeft geen choices.`
                    );
                }

                return {
                    choices: field.choices.map(choice => ({
                        name: choice
                    }))
                };

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