const FieldTypes = require("../config/fieldTypes");

module.exports = {

    table: "Accommodaties",

    fields: [

        {
            id: "description_test",

            order: 10,

            labels: {
                airtable: "Description Test",
                app: "Description Test",
                website: "Description Test"
            },

            description: "Controle of descriptions via de Metadata Write API worden aangemaakt.",
            helpText: "",

            type: FieldTypes.TEXT,

            required: false,
            readonly: false,
            hidden: false,

            defaultValue: null,
            unit: null,

            options: {},

            validation: {}

        }

    ]

};
