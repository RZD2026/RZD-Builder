
const FieldTypes = require("../config/fieldTypes");

class SchemaValidator {

    validate(module) {

        const errors = [];

        if (!module) {
            errors.push("Module ontbreekt.");
            return errors;
        }

        if (!module.fields || !Array.isArray(module.fields)) {
            errors.push("Module bevat geen geldige fields-array.");
            return errors;
        }

        const validTypes = Object.values(FieldTypes);

        module.fields.forEach((field, index) => {

            const prefix = `Veld ${index + 1}`;

            // ------------------------
            // Naam
            // ------------------------

            if (!field.name || field.name.trim() === "") {
                errors.push(`${prefix}: naam ontbreekt.`);
            }

            // ------------------------
            // Type
            // ------------------------

            if (!field.type || field.type.trim() === "") {

                errors.push(`${prefix}: type ontbreekt.`);

            } else if (!validTypes.includes(field.type)) {

                errors.push(
                    `${prefix}: onbekend veldtype '${field.type}'.`
                );

            }

            // ------------------------
            // Description
            // ------------------------

            if (
                field.description !== undefined &&
                typeof field.description !== "string"
            ) {

                errors.push(
                    `${prefix}: description moet een string zijn.`
                );

            }

            // ------------------------
            // Group
            // ------------------------

            if (
                field.group !== undefined &&
                typeof field.group !== "string"
            ) {

                errors.push(
                    `${prefix}: group moet een string zijn.`
                );

            }

            // ------------------------
            // HelpText
            // ------------------------

            if (
                field.helpText !== undefined &&
                typeof field.helpText !== "string"
            ) {

                errors.push(
                    `${prefix}: helpText moet een string zijn.`
                );

            }

            // ------------------------
            // Required
            // ------------------------

            if (
                field.required !== undefined &&
                typeof field.required !== "boolean"
            ) {

                errors.push(
                    `${prefix}: required moet true of false zijn.`
                );

            }

            // ------------------------
            // Choices
            // ------------------------

            if (
                field.type === FieldTypes.SINGLESELECT ||
                field.type === FieldTypes.MULTISELECT
            ) {

                if (
                    !field.choices ||
                    !Array.isArray(field.choices) ||
                    field.choices.length === 0
                ) {

                    errors.push(
                        `${prefix}: ${field.name} heeft geen choices.`
                    );

                }

            } else if (field.choices !== undefined) {

                errors.push(
                    `${prefix}: choices zijn alleen toegestaan bij SingleSelect en MultiSelect.`
                );

            }

        });

        return errors;

    }

}

module.exports = new SchemaValidator();