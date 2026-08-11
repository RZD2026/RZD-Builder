module.exports = {

    parking: {
        status: "EXACT",
        airtable: {
            module: "Parkeren",
            name: "Parkeerplaats aanwezig"
        }
    },

    accessible_parking: {
        status: "EXACT",
        airtable: {
            module: "Parkeren",
            name: "Rolstoelparkeerplaats aanwezig"
        }
    },

    parking_distance: {
        status: "EXACT",
        airtable: {
            module: "Parkeren",
            name: "Afstand parkeren tot entree"
        }
    },

    parking_surface: {
        status: "EXACT",
        airtable: {
            module: "Parkeren",
            name: "Ondergrond parkeerplaats"
        }
    },

    entrance_route: {
        status: "POSSIBLE",
        airtable: {
            module: "Strand & Recreatie",
            name: "Toegankelijke routes"
        }
    },

    route_slope: {
        status: "NO_MATCH"
    },

    entrance_threshold: {
        status: "EXACT",
        airtable: {
            module: "Toegang & Entree",
            name: "Drempelhoogte entree"
        }
    },

    main_entrance_accessible: {
        status: "NO_MATCH"
    },

    automatic_door: {
        status: "NO_MATCH"
    },

    entrance_turning_circle: {
        status: "EXACT",
        airtable: {
            module: "Toegang & Entree",
            name: "Draaicirkel bij entree"
        }
    }

};