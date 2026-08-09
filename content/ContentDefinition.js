const CONTENT_TYPES = [
    "checkbox",
    "number",
    "text",
    "longtext",
    "select",
    "attachment"
];

class ContentDefinition {

    static create(definition) {

        if (!definition || typeof definition !== "object") {
            throw new Error(
                "ContentDefinition moet een object zijn."
            );
        }

        return {
            id: definition.id,

            order: definition.order ?? 0,

            labels: {
                app: definition.labels?.app ?? "",
                website: definition.labels?.website ?? ""
            },

            description: definition.description ?? "",

            type: definition.type,

            required: definition.required ?? false,

            unit: definition.unit ?? null
        };

    }

    static validate(definition) {

        const errors = [];

        if (!definition || typeof definition !== "object") {
            return [
                "ContentDefinition moet een object zijn."
            ];
        }

        if (
            typeof definition.id !== "string" ||
            definition.id.trim() === ""
        ) {
            errors.push("id ontbreekt.");
        }

        if (!Number.isFinite(definition.order)) {
            errors.push("order moet een nummer zijn.");
        }

        if (
            !definition.labels ||
            typeof definition.labels !== "object"
        ) {
            errors.push("labels ontbreken.");
        } else {

            if (
                typeof definition.labels.app !== "string" ||
                definition.labels.app.trim() === ""
            ) {
                errors.push("labels.app ontbreekt.");
            }

            if (
                typeof definition.labels.website !== "string" ||
                definition.labels.website.trim() === ""
            ) {
                errors.push("labels.website ontbreekt.");
            }

        }

        if (
            typeof definition.type !== "string" ||
            !CONTENT_TYPES.includes(definition.type)
        ) {
            errors.push(
                `Ongeldig content type: ${definition.type}`
            );
        }

        if (typeof definition.required !== "boolean") {
            errors.push("required moet een boolean zijn.");
        }

        if (
            definition.unit !== null &&
            typeof definition.unit !== "string"
        ) {
            errors.push("unit moet null of een string zijn.");
        }

        if (
            definition.type !== "number" &&
            definition.unit !== null
        ) {
            errors.push(
                "unit mag alleen bij type 'number' worden gebruikt."
            );
        }

        return errors;

    }

    static getTypes() {

        return [...CONTENT_TYPES];

    }

    static isValidType(type) {

        return CONTENT_TYPES.includes(type);

    }

}

module.exports = ContentDefinition;