const ContentDefinition = require("./contentDefinition");

class ContentEngine {

    load(module) {

        if (!module || typeof module !== "object") {
            throw new Error(
                "ContentEngine: module moet een object zijn."
            );
        }

        return module;

    }

    normalize(module) {

        return {
            id: module.id,

            order: module.order ?? 0,

            labels: {
                app: module.labels?.app ?? "",
                website: module.labels?.website ?? ""
            },

            description: module.description ?? "",

            points: (module.points ?? []).map(point =>
                ContentDefinition.create(point)
            )
        };

    }

    validate(module) {

        const errors = [];

        if (!module || typeof module !== "object") {
            return [
                "Module moet een object zijn."
            ];
        }

        if (
            typeof module.id !== "string" ||
            module.id.trim() === ""
        ) {
            errors.push("Module id ontbreekt.");
        }

        if (!Number.isFinite(module.order)) {
            errors.push("Module order moet een nummer zijn.");
        }

        if (
            !module.labels ||
            typeof module.labels !== "object"
        ) {
            errors.push("Module labels ontbreken.");

        } else {

            if (
                typeof module.labels.app !== "string" ||
                module.labels.app.trim() === ""
            ) {
                errors.push("Module labels.app ontbreekt.");
            }

            if (
                typeof module.labels.website !== "string" ||
                module.labels.website.trim() === ""
            ) {
                errors.push("Module labels.website ontbreekt.");
            }

        }

        if (!Array.isArray(module.points)) {
            errors.push("Module points moet een array zijn.");

            return errors;
        }

        const ids = new Set();

        module.points.forEach((point, index) => {

            const pointErrors =
                ContentDefinition.validate(point);

            pointErrors.forEach(error => {

                errors.push(
                    `Punt ${index + 1}: ${error}`
                );

            });

            if (
                typeof point.id === "string" &&
                point.id.trim() !== ""
            ) {

                if (ids.has(point.id)) {

                    errors.push(
                        `Dubbele Content ID: ${point.id}`
                    );

                } else {

                    ids.add(point.id);

                }

            }

        });

        return errors;

    }

    buildModule(module) {

        const loaded = this.load(module);

        const normalized =
            this.normalize(loaded);

        const errors =
            this.validate(normalized);

        if (errors.length > 0) {

            const error =
                new Error(
                    "ContentEngine validatie mislukt."
                );

            error.validationErrors = errors;

            throw error;

        }

        return normalized;

    }

    build(modules) {

        const moduleList =
            Array.isArray(modules)
                ? modules
                : [modules];

        const normalizedModules = [];

        const moduleIds = new Set();

        for (const module of moduleList) {

            const normalized =
                this.buildModule(module);

            if (moduleIds.has(normalized.id)) {

                const error =
                    new Error(
                        "ContentEngine validatie mislukt."
                    );

                error.validationErrors = [
                    `Dubbele Module ID: ${normalized.id}`
                ];

                throw error;

            }

            moduleIds.add(normalized.id);

            normalizedModules.push(normalized);

        }

        normalizedModules.sort(
            (a, b) => a.order - b.order
        );

        return {
            version: 1,

            modules: normalizedModules
        };

    }

}

module.exports = new ContentEngine();