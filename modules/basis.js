
const FieldTypes = require("../config/fieldTypes");

const fields = [

    {
        name: "Naam",
        type: FieldTypes.TEXT
    },

    {
        name: "Type accommodatie",
        type: FieldTypes.SINGLESELECT,
        choices: [
            "Camping",
            "Hotel",
            "Appartement",
            "Vakantiepark",
            "Camperplaats",
            "B&B"
        ]
    },

    {
        name: "Land",
        type: FieldTypes.TEXT
    },

    {
        name: "Regio",
        type: FieldTypes.TEXT
    },

    {
        name: "Plaats",
        type: FieldTypes.TEXT
    },

    {
        name: "Adres",
        type: FieldTypes.TEXT
    },

    {
        name: "Website",
        type: FieldTypes.URL
    },

    {
        name: "Telefoon",
        type: FieldTypes.PHONE
    },

    {
        name: "E-mail",
        type: FieldTypes.EMAIL
    },

    {
        name: "GPS",
        type: FieldTypes.TEXT
    }

];

module.exports = {
    table: "Accommodaties",
    fields
};