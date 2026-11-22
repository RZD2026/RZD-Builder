module.exports = {

    id: "toegang",

    order: 10,

    labels: {
        app: "Toegang & Entree",
        website: "Toegang & Entree"
    },

    description:
        "Informatie over de toegankelijkheid van parkeren, route en entree.",

    points: [

        {
            id: "parking",
            order: 10,

            labels: {
                app: "Parkeerplaats",
                website: "Parkeerplaats aanwezig"
            },

            description:
                "Er is een parkeerplaats aanwezig.",

            type: "checkbox",
            required: false
        },

        {
            id: "accessible_parking",
            order: 20,

            labels: {
                app: "Gehandicaptenparkeerplaats",
                website: "Gehandicaptenparkeerplaats"
            },

            description:
                "Er is een gehandicaptenparkeerplaats aanwezig.",

            type: "checkbox",
            required: false
        },

        {
            id: "parking_notes",
            order: 30,

            labels: {
                app: "Parkeren opmerkingen",
                website: "Parkeren opmerkingen"
            },

            description:
                "Vastlegging van aanvullende parkeerinformatie, zoals afstand en ligging van de parkeerplaats, ondergrond, helling, reservering, hoogtebeperkingen en de route vanaf de parkeerplaats naar de ingang.",

            type: "text",
            required: false
        },

        {
            id: "route_slope",
            order: 40,

            labels: {
                app: "Hellingspercentage",
                website: "Hellingspercentage route"
            },

            description:
                "Hellingspercentage van de route.",

            type: "number",
            unit: "%",
            required: false
        },

        {
            id: "entrance_threshold",
            order: 50,

            labels: {
                app: "Drempel ingang",
                website: "Drempel bij ingang"
            },

            description:
                "Hoogte van de drempel bij de ingang.",

            type: "number",
            unit: "cm",
            required: false
        },

        {
            id: "main_entrance_accessible",
            order: 60,

            labels: {
                app: "Hoofdingang",
                website: "Hoofdingang toegankelijk"
            },

            description:
                "De hoofdingang is toegankelijk.",

            type: "checkbox",
            required: false
        },

        {
            id: "automatic_door",
            order: 70,

            labels: {
                app: "Automatische deur",
                website: "Automatische deur"
            },

            description:
                "De ingang heeft een automatische deur.",

            type: "checkbox",
            required: false
        },

        {
            id: "entrance_turning_circle",
            order: 80,

            labels: {
                app: "Draaicirkel",
                website: "Draaicirkel entree"
            },

            description:
                "Beschikbare draaicirkel bij de entree.",

            type: "number",
            unit: "cm",
            required: false
        }

    ]

};