const FieldTypes = require("../config/fieldTypes");

const fields = [

    {
        name: "Parkeerplaats",
        type: FieldTypes.CHECKBOX
    },

    {
        name: "Gehandicaptenparkeerplaats",
        type: FieldTypes.CHECKBOX
    },

    {
        name: "Afstand parkeerplaats tot ingang",
        type: FieldTypes.NUMBER
    },

    {
        name: "Ondergrond parkeerplaats",
        type: FieldTypes.TEXT
    },

    {
        name: "Route naar ingang",
        type: FieldTypes.TEXT
    },

    {
        name: "Hellingspercentage route",
        type: FieldTypes.NUMBER
    },

    {
        name: "Drempel ingang",
        type: FieldTypes.NUMBER
    },

    {
        name: "Hoofdingang toegankelijk",
        type: FieldTypes.CHECKBOX
    },

    {
        name: "Automatische deur",
        type: FieldTypes.CHECKBOX
    },

    {
        name: "Draaicirkel entree",
        type: FieldTypes.NUMBER
    }

];

module.exports = {
    fields
};

