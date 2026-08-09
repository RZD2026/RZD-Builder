class BuilderContext {

    constructor({
        module,
        tableName,
        airtableFields,
        logger,
        options = {}
    }) {

        this.module = module;
        this.tableName = tableName;
        this.airtableFields = airtableFields;
        this.logger = logger;
        this.options = options;

    }

    getAirtableName(field) {

        return field.labels?.airtable || field.name;

    }

    getField(field) {

        const fieldName =
            typeof field === "string"
                ? field
                : this.getAirtableName(field);

        return this.airtableFields.find(
            airtableField => airtableField.name === fieldName
        );

    }

    fieldExists(field) {

        return this.getField(field) !== undefined;

    }

    getMissingFields() {

        return this.module.fields.filter(
            field => !this.fieldExists(field)
        );

    }

    getExistingFields() {

        return this.module.fields.filter(
            field => this.fieldExists(field)
        );

    }

}

module.exports = BuilderContext;