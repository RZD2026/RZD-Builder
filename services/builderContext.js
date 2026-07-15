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

    getField(fieldName) {

        return this.airtableFields.find(
            field => field.name === fieldName
        );

    }

    fieldExists(fieldName) {

        return this.getField(fieldName) !== undefined;

    }

    getMissingFields() {

        return this.module.fields.filter(field => !this.fieldExists(field.name));

    }

    getExistingFields() {

        return this.module.fields.filter(field => this.fieldExists(field.name));

    }

}

module.exports = BuilderContext;