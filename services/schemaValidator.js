const FieldTypes = require("../config/fieldTypes");

class SchemaValidator {

    validate(module) {

        const errors = [];

        if (!module) {
            errors.push("Module ontbreekt.");
            return errors;
        }

        if (!Array.isArray(module.fields)) {
            errors.push("Module bevat geen geldige fields-array.");
            return errors;
        }

        const validTypes = Object.values(FieldTypes);

        module.fields.forEach((field, index) => {

            const prefix = `Veld ${index + 1}`;

            this.validateId(field, errors, prefix);
            this.validateOrder(field, errors, prefix);
            this.validateLabels(field, errors, prefix);
            this.validateName(field, errors, prefix);
            this.validateType(field, validTypes, errors, prefix);
            this.validateDescription(field, errors, prefix);
            this.validateRequired(field, errors, prefix);
            this.validateUnit(field, errors, prefix);
            this.validateValidation(field, errors, prefix);
            this.validateChoices(field, errors, prefix);

        });

        return errors;

    }

    validateId(field, errors, prefix) {

        if (
            field.id !== undefined &&
            typeof field.id !== "string"
        ) {

            errors.push(
                `${prefix}: id moet een string zijn.`
            );

        }

    }

    validateOrder(field, errors, prefix) {

        if (
            field.order !== undefined &&
            !Number.isInteger(field.order)
        ) {

            errors.push(
                `${prefix}: order moet een geheel getal zijn.`
            );

        }

    }

    validateLabels(field, errors, prefix) {

        if (field.labels === undefined) {
            return;
        }

        if (typeof field.labels !== "object") {

            errors.push(
                `${prefix}: labels moet een object zijn.`
            );

            return;

        }

        ["airtable", "app", "website"].forEach(label => {

            if (!(label in field.labels)) {

                errors.push(
                    `${prefix}: labels.${label} ontbreekt.`
                );

                return;

            }

            if (typeof field.labels[label] !== "string") {

                errors.push(
                    `${prefix}: labels.${label} moet een string zijn.`
                );

                return;

            }

            if (field.labels[label].trim() === "") {

                errors.push(
                    `${prefix}: labels.${label} mag niet leeg zijn.`
                );

            }

        });

    }

    validateName(field, errors, prefix) {

        // Nieuw model:
        // name OF labels.airtable is voldoende

        const name =
            field.name ??
            field.labels?.airtable;

        if (
            !name ||
            typeof name !== "string" ||
            name.trim() === ""
        ) {

            errors.push(
                `${prefix}: naam ontbreekt.`
            );

        }

    }

    validateType(field, validTypes, errors, prefix) {

        if (!field.type || field.type.trim() === "") {

            errors.push(
                `${prefix}: type ontbreekt.`
            );

            return;

        }

        if (!validTypes.includes(field.type)) {

            errors.push(
                `${prefix}: onbekend veldtype '${field.type}'.`
            );

        }

    }

    validateDescription(field, errors, prefix) {

        if (
            field.description !== undefined &&
            typeof field.description !== "string"
        ) {

            errors.push(
                `${prefix}: description moet een string zijn.`
            );

        }

    }

    validateRequired(field, errors, prefix) {

        if (
            field.required !== undefined &&
            typeof field.required !== "boolean"
        ) {

            errors.push(
                `${prefix}: required moet true of false zijn.`
            );

        }

    }

    validateUnit(field, errors, prefix) {

        if (
            field.unit !== undefined &&
            field.unit !== null &&
            typeof field.unit !== "string"
        ) {

            errors.push(
                `${prefix}: unit moet een string of null zijn.`
            );

        }

    }

    validateValidation(field, errors, prefix) {

        if (
            field.validation !== undefined &&
            typeof field.validation !== "object"
        ) {

            errors.push(
                `${prefix}: validation moet een object zijn.`
            );

        }

    }

    validateChoices(field, errors, prefix) {

        if (
            field.type === FieldTypes.SINGLESELECT ||
            field.type === FieldTypes.MULTISELECT
        ) {

            const choices =
                field.choices ||
                field.options?.choices ||
                field.listDefinition?.values?.map(value => ({
                    name: value
                }));

            if (
                !choices ||
                !Array.isArray(choices) ||
                choices.length === 0
            ) {

                const fieldName =
                    field.name ??
                    field.labels?.airtable ??
                    field.id;

                errors.push(
                    `${prefix}: ${fieldName} heeft geen choices.`
                );

            }

        } else if (
            field.choices !== undefined ||
            field.options?.choices !== undefined
        ) {

            errors.push(
                `${prefix}: choices zijn alleen toegestaan bij SingleSelect en MultiSelect.`
            );

        }

    }

}

module.exports = new SchemaValidator();