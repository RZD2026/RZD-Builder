
const {
    isEmpty,
    isDuplicate,
    isValidId,
    isKnownFieldType
} = require("./validators");

function fields(model) {

    const report = {

        missingLabels: [],
        duplicateFieldIds: [],
        missingIds: [],
        invalidIds: [],
        missingTypes: [],
        unknownTypes: []

    };

    for (const table of model.tables) {

        const ids = new Set();

        for (const field of table.fields) {

            if (isEmpty(field.id)) {

                report.missingIds.push({
                    table: table.id,
                    field: "(unknown)"
                });

                continue;

            }

            if (!isValidId(field.id)) {

                report.invalidIds.push({
                    table: table.id,
                    field: field.id
                });

            }

            if (isDuplicate(ids, field.id)) {

                report.duplicateFieldIds.push({
                    table: table.id,
                    field: field.id
                });

            }

            if (isEmpty(field.type)) {

                report.missingTypes.push({
                    table: table.id,
                    field: field.id
                });

            } else if (!isKnownFieldType(field.type)) {

                report.unknownTypes.push({
                    table: table.id,
                    field: field.id,
                    type: field.type
                });

            }

            if (isEmpty(field.label)) {

                report.missingLabels.push({
                    table: table.id,
                    field: field.id
                });

            }

        }

    }

    return report;

}

module.exports = fields;