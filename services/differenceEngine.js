class DifferenceEngine {

    build(localField, airtableField, differences) {

        return differences.map(property => ({

            property,

            local: this.getValue(localField, property),

            remote: this.getValue(airtableField, property)

        }));

    }

    getValue(object, property) {

        const parts = property.split(".");

        let value = object;

        for (const part of parts) {

            if (value === undefined || value === null) {
                return null;
            }

            value = value[part];

        }

        return value ?? null;

    }

}

module.exports = new DifferenceEngine();