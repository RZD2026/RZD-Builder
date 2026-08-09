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
        id: "parking_distance",

        order: 30,

        labels: {
            airtable: "Afstand",
            app: "Afstand parkeerplaats",
            website: "Afstand parkeerplaats tot ingang"
        },

        description: "Afstand van de parkeerplaats tot de ingang.",
        helpText: "",

        type: FieldTypes.NUMBER,

        required: false,
        readonly: false,
        hidden: false,

        defaultValue: null,
        unit: "meter",

        options: {},

        validation: {}
    },

    {
        id: "parking_surface",

        order: 40,

        labels: {
            airtable: "Ondergrond",
            app: "Ondergrond",
            website: "Ondergrond parkeerplaats"
        },

        description: "Type ondergrond van de parkeerplaats.",
        helpText: "",

        type: FieldTypes.TEXT,

        required: false,
        readonly: false,
        hidden: false,

        defaultValue: null,
        unit: null,

        options: {},

        validation: {}
    },

    {
        id: "route_to_entrance",

        order: 50,

        labels: {
            airtable: "Route",
            app: "Route ingang",
            website: "Route naar ingang"
        },

        description: "Beschrijving van de route naar de ingang.",
        helpText: "",

        type: FieldTypes.TEXT,

        required: false,
        readonly: false,
        hidden: false,

        defaultValue: null,
        unit: null,

        options: {},

        validation: {}
    },

    {
        id: "route_slope",

        order: 60,

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

        order: 70,

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

        order: 80,

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

        order: 90,

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

        order: 100,

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