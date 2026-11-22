module.exports = {

    parking: {
        status: "EXACT",
        airtable: {
            module: "Parkeren",
            name: "Parkeerplaats bij accommodatie aanwezig",
            recordId: "recI6rZO6eGjP4tUS"
        }
    },

    accessible_parking: {
        status: "EXACT",
        airtable: {
            module: "Parkeren",
            name: "GPK-plaats aanwezig",
            recordId: "rec2bCHQvPPxwxn4O"
        }
    },

    parking_notes: {
        status: "EXACT",
        airtable: {
            module: "Parkeren",
            name: "Parkeren opmerkingen",
            recordId: "recwAXGNhEwG4JTz9"
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