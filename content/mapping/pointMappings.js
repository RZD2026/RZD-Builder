module.exports = {

    parking: {
        status: "EXACT",
        airtable: {
            module: "Parkeren",
            name: "Parkeerplaats bij accommodatie aanwezig"
        }
    },

    accessible_parking: {
        status: "EXACT",
        airtable: {
            module: "Parkeren",
            name: "GPK-plaats aanwezig"
        }
    },

    parking_distance: {
        status: "NO_MATCH"
    },

    parking_surface: {
        status: "NO_MATCH"
    },

    entrance_route: {
        status: "NO_MATCH"
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