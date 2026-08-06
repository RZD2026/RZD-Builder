/**
 * -------------------------------------------------------
 * AUTO GENERATED
 * Niet handmatig wijzigen.
 * Gegenereerd vanuit Canon.
 * -------------------------------------------------------
 */

module.exports = {
    "source": "accommodaties.yaml",
    "id": "accommodations",
    "airtable": "Accommodaties",
    "meta": {
        "id": "ACC-T001",
        "version": "1.0.0",
        "status": "active",
        "name": "Accommodaties",
        "description": "Hoofdtabel met alle accommodaties"
    },
    "name": "Accommodaties",
    "description": "Hoofdtabel met alle accommodaties",
    "fields": [
        {
            "id": "ACC-F001",
            "name": "Naam",
            "type": "TEXT",
            "description": "Naam van de accommodatie",
            "group": "Basisgegevens",
            "required": true,
            "listDefinition": null
        },
        {
            "id": "ACC-F002",
            "name": "Type accommodatie",
            "type": "SINGLESELECT",
            "list": "accommodation-types",
            "description": "Type accommodatie",
            "group": "Basisgegevens",
            "required": true,
            "listDefinition": {
                "meta": {
                    "id": "ACC-L001",
                    "version": "1.0.0",
                    "status": "active"
                },
                "id": "accommodation-types",
                "name": {
                    "nl": "Type accommodatie",
                    "en": "Accommodation type"
                },
                "values": [
                    "Camping",
                    "Hotel",
                    "Appartement",
                    "Vakantiepark",
                    "Camperplaats",
                    "B&B"
                ]
            }
        },
        {
            "id": "ACC-F003",
            "name": "Land",
            "type": "TEXT",
            "description": "Land",
            "group": "Locatie",
            "listDefinition": null
        },
        {
            "id": "ACC-F004",
            "name": "Regio",
            "type": "TEXT",
            "description": "Regio",
            "group": "Locatie",
            "listDefinition": null
        },
        {
            "id": "ACC-F005",
            "name": "Plaats",
            "type": "TEXT",
            "description": "Plaats",
            "group": "Locatie",
            "listDefinition": null
        },
        {
            "id": "ACC-F006",
            "name": "Adres",
            "type": "TEXT",
            "description": "Straat en huisnummer",
            "group": "Locatie",
            "listDefinition": null
        }
    ]
};
