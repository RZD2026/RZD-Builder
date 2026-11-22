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

        if (typeof field === "string") {
            return field;
        }

        return (
            field?.labels?.airtable ??
            field?.name ??
            field?.id
        );

    }

    getField(field) {

        const fieldName = this.getAirtableName(field);

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