const AirtableTypeMapper = require("./airtableTypeMapper");
const ContentDefinition = require("../ContentDefinition");

class SchemaEngine {

    build(canonModel) {

        if (!canonModel || typeof canonModel !== "object") {
            throw new Error(
                "SchemaEngine: Canon Model moet een object zijn."
            );
        }

        if (!Array.isArray(canonModel.modules)) {
            throw new Error(
                "SchemaEngine: Canon Model moet modules bevatten."
            );
        }

        return {
            version: 1,

            tables: [
                this.buildAccommodatiesTable(),
                this.buildContentModulesTable(),
                this.buildContentPointsTable(),
                this.buildReviewsTable()
            ]
        };
    }

    buildAccommodatiesTable() {

        return {
            name: "Accommodaties",

            fields: [
                this.field("Naam", "text"),
                this.field("Type", "singleSelect"),
                this.field("Land", "text"),
                this.field("Regio", "text"),
                this.field("Plaats", "text"),
                this.field("Adres", "text"),
                this.field("Website", "url"),
                this.field("Telefoon", "phone"),
                this.field("E-mail", "email"),
                this.field("GPS", "text")
            ]
        };
    }

    buildContentModulesTable() {

        return {
            name: "Content Modules",

            fields: [
                this.field("ID", "text"),
                this.field("Naam", "text"),
                this.field("Volgorde", "number"),
                this.field("Beschrijving", "longText"),
                this.field("Actief", "checkbox")
            ]
        };
    }

    buildContentPointsTable() {

        return {
            name: "Beoordelingspunten",

            fields: [
                this.field("ID", "text"),

                {
                    name: "Module",
                    type: AirtableTypeMapper.toAirtable("link"),
                    linkedTable: "Content Modules"
                },

                this.field("Volgorde", "number"),
                this.field("Naam", "text"),
                this.field("App-label", "text"),
                this.field("Website-label", "text"),
                this.field("Beschrijving", "longText"),

                {
                    name: "Type",
                    type: AirtableTypeMapper.toAirtable(
                        "singleSelect"
                    ),
                    choices: ContentDefinition.getTypes()
                },

                this.field("Eenheid", "text"),
                this.field("Verplicht", "checkbox"),
                this.field("Actief", "checkbox")
            ]
        };
    }

    buildReviewsTable() {

        return {
            name: "Accommodatie Beoordelingen",

            fields: [
                this.field("ID", "text"),

                {
                    name: "Accommodatie",
                    type: AirtableTypeMapper.toAirtable("link"),
                    linkedTable: "Accommodaties"
                },

                {
                    name: "Beoordelingspunt",
                    type: AirtableTypeMapper.toAirtable("link"),
                    linkedTable: "Beoordelingspunten"
                },

                this.field("Waarde tekst", "text"),
                this.field("Waarde getal", "number"),
                this.field("Waarde ja/nee", "checkbox"),
                this.field("Waarde datum", "date"),
                this.field("Waarde bijlage", "attachment"),
                this.field("Opmerking", "longText"),
                this.field("Bron", "url"),
                this.field("Datum", "date"),
                this.field("Geverifieerd", "checkbox")
            ]
        };
    }

    field(name, canonType) {

        return {
            name,
            type: AirtableTypeMapper.toAirtable(canonType)
        };
    }

}

module.exports = new SchemaEngine();