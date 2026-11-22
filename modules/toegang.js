const FieldTypes = require("../config/fieldTypes");

const fields = [

    {
        id: "parking",

        order: 10,

        labels: {
            airtable: "Parkeerpl.",
            app: "Parkeerplaats",
            website: "Parkeerplaats aanwezig"
        },

        description: "Er is een parkeerplaats aanwezig.",
        helpText: "",

        type: FieldTypes.CHECKBOX,

        required: false,
        readonly: false,
        hidden: false,

        defaultValue: false,
        unit: null,

        options: {},

        validation: {}
    },

    {
        id: "accessible_parking",

        order: 20,

        labels: {
            airtable: "GHP",
            app: "Gehandicaptenparkeerplaats",
            website: "Gehandicaptenparkeerplaats"
        },

        description: "Er is een gehandicaptenparkeerplaats aanwezig.",
        helpText: "",

        type: FieldTypes.CHECKBOX,

        required: false,
        readonly: false,
        hidden: false,

        defaultValue: false,
        unit: null,

        options: {},

        validation: {}
    },

    {
        id: "route_slope",

        order: 30,

        labels: {
            airtable: "Helling %",
            app: "Hellingspercentage",
            website: "Hellingspercentage route"
        },

        description: "Hellingspercentage van de route.",
        helpText: "",

        type: FieldTypes.NUMBER,

        required: false,
        readonly: false,
        hidden: false,

        defaultValue: null,
        unit: "%",

        options: {},

        validation: {}
    },

    {
        id: "entrance_threshold",

        order: 40,

        labels: {
            airtable: "Drempel",
            app: "Drempel ingang",
            website: "Drempel bij ingang"
        },

        description: "Hoogte van de drempel bij de ingang.",
        helpText: "",

        type: FieldTypes.NUMBER,

        required: false,
        readonly: false,
        hidden: false,

        defaultValue: null,
        unit: "cm",

        options: {},

        validation: {}
    },

    {
        id: "main_entrance_accessible",

        order: 50,

        labels: {
            airtable: "Hoofding.",
            app: "Hoofdingang",
            website: "Hoofdingang toegankelijk"
        },

        description: "De hoofdingang is toegankelijk.",
        helpText: "",

        type: FieldTypes.CHECKBOX,

        required: false,
        readonly: false,
        hidden: false,

        defaultValue: false,
        unit: null,

        options: {},

        validation: {}
    },

    {
        id: "automatic_door",

        order: 60,

        labels: {
            airtable: "Auto deur",
            app: "Automatische deur",
            website: "Automatische deur"
        },

        description: "De ingang heeft een automatische deur.",
        helpText: "",

        type: FieldTypes.CHECKBOX,

        required: false,
        readonly: false,
        hidden: false,

        defaultValue: false,
        unit: null,

        options: {},

        validation: {}
    },

    {
        id: "turning_circle",

        order: 70,

        labels: {
            airtable: "Draaicirkel",
            app: "Draaicirkel",
            website: "Draaicirkel entree"
        },

        description: "Beschikbare draaicirkel bij de entree.",
        helpText: "",

        type: FieldTypes.NUMBER,

        required: false,
        readonly: false,
        hidden: false,

        defaultValue: null,
        unit: "cm",

        options: {},

        validation: {}
    }

];

module.exports = {
    table: "Accommodaties",
    fields
};