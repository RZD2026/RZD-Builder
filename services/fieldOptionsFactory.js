
class FieldOptionsFactory {

    static get(type) {

        switch (type) {

            case "checkbox":
                return {
                    icon: "check",
                    color: "greenBright"
                };

            case "number":
                return {
                    precision: 1
                };

            default:
                return null;

        }

    }

}

module.exports = FieldOptionsFactory;