class MetadataEngine {

    supports(difference) {

        switch (difference) {

            case "description":
            case "options.precision":
            case "options.icon":
            case "options.color":
                return true;

            case "options.choices":
                return false;

            default:
                return false;

        }

    }

}

module.exports = new MetadataEngine();
