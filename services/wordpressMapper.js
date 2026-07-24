
class WordPressMapper {

    mapAccommodation(record = {}) {

        return {

            title: record.Naam || "",

            status: "draft",

            meta: {

                land: record.Land || "",

                regio: record.Regio || "",

                plaats: record.Plaats || "",

                adres: record.Adres || "",

                website: record.Website || "",

                telefoon: record.Telefoon || "",

                email: record["E-mail"] || "",

                gps: record.GPS || ""

            }

        };

    }

}

module.exports = new WordPressMapper();