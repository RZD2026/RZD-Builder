class DifferenceEngine {

    build(localField, airtableField, differences) {

        return differences.map(property => ({

            property,

            local: this.getLocalValue(localField, property),

            remote: this.getValue(airtableField, property)

        }));

    }

    getLocalValue(field, property) {

        // Builder v2
        if (property === "name") {

            return (
                field?.labels?.airtable ??
                field?.name ??
                field?.id ??
                null
            );

        }

        return this.getValue(field, property);

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