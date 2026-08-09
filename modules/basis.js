const FieldTypes = require("../config/fieldTypes");

const fields = [

    {
        id: "name",
        order: 10,

        labels: {
            airtable: "Naam",
            app: "Naam",
            website: "Naam accommodatie"
        },

        description: "Officiële naam van de accommodatie.",
        helpText: "",

        type: FieldTypes.TEXT,

        required: true,
        readonly: false,
        hidden: false,

        defaultValue: null,
        unit: null,

        options: {},

        validation: {}
    },

    {
        id: "type",
        order: 20,

        labels: {
        airtable: "Type accommodatie",
        app: "Type accommodatie",
        website: "Type accommodatie"
        },

        description: "Soort accommodatie.",
        helpText: "",

        type: FieldTypes.SINGLESELECT,

        required: true,
        readonly: false,
        hidden: false,

        defaultValue: null,
        unit: null,

        options: {
            choices: [
                { name: "Camping" },
                { name: "Hotel" },
                { name: "Appartement" },
                { name: "Vakantiepark" },
                { name: "Camperplaats" },
                { name: "B&B" }
            ]
        },

        validation: {}
    },

    {
        id: "country",
        order: 30,

        name: "Land",

        type: FieldTypes.TEXT,

        options: {},
        validation: {}
    },

    {
        id: "region",
        order: 40,

        name: "Regio",

        type: FieldTypes.TEXT,

        options: {},
        validation: {}
    },

    {
        id: "city",
        order: 50,

        name: "Plaats",

        type: FieldTypes.TEXT,

        options: {},
        validation: {}
    },

    {
        id: "address",
        order: 60,

        name: "Adres",

        type: FieldTypes.TEXT,

        options: {},
        validation: {}
    },

    {
        id: "website",
        order: 70,

        name: "Website",

        type: FieldTypes.URL,

        options: {},
        validation: {}
    },

    {
        id: "phone",
        order: 80,

        name: "Telefoon",

        type: FieldTypes.PHONE,

        options: {},
        validation: {}
    },

    {
        id: "email",
        order: 90,

        name: "E-mail",

        type: FieldTypes.EMAIL,

        options: {},
        validation: {}
    },

    {
        id: "gps",
        order: 100,

        name: "GPS",

        type: FieldTypes.TEXT,

        options: {},
        validation: {}
    }

];

module.exports = {
    table: "Accommodaties",
    fields
};