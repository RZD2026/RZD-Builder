
const FieldTypes = require("../config/fieldTypes");

class SchemaValidator {

    validate(module) {

        const errors = [];

        if (!module.fields || !Array.isArray(module.fields)) {

            errors.push("Module bevat geen geldige fields-array.");
            return errors;

        }

        module.fields.forEach((field, index) => {

            const prefix = `Veld ${index + 1}`;

            if (!field.name || field.name.trim() === "") {
                errors.push(`${prefix}: naam ontbreekt.`);
            }

            if (!field.type || field.type.trim() === "") {
                errors.push(`${prefix}: type ontbreekt.`);
            }

            const validTypes = Object.values(FieldTypes);

            if (field.type && !validTypes.includes(field.type)) {
                errors.push(
                    `${prefix}: onbekend veldtype '${field.type}'.`
                );
            }

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

            }

            if (
                field.type !== FieldTypes.SINGLESELECT &&
                field.type !== FieldTypes.MULTISELECT &&
                field.choices
            ) {

                errors.push(
                    `${prefix}: choices zijn alleen toegestaan bij SingleSelect en MultiSelect.`
                );

            }

        });

        return errors;

    }

}

module.exports = new SchemaValidator();