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
            id: "parking_distance",
            order: 30,

            labels: {
                app: "Afstand parkeerplaats",
                website: "Afstand parkeerplaats tot ingang"
            },

            description:
                "Afstand van de parkeerplaats tot de ingang.",

            type: "number",
            unit: "meter",
            required: false
        },

        {
            id: "parking_surface",
            order: 40,

            labels: {
                app: "Ondergrond",
                website: "Ondergrond parkeerplaats"
            },

            description:
                "Type ondergrond van de parkeerplaats.",

            type: "text",
            required: false
        },

        {
            id: "entrance_route",
            order: 50,

            labels: {
                app: "Route ingang",
                website: "Route naar ingang"
            },

            description:
                "Beschrijving van de route naar de ingang.",

            type: "text",
            required: false
        },

        {
            id: "route_slope",
            order: 60,

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
            order: 70,

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
            order: 80,

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
            order: 90,

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
            order: 100,

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