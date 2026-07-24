
const FieldOptionsFactory = require("./fieldOptionsFactory");
const metadataEngine = require("./engines/metadataEngine");
const mcpEngine = require("./engines/mcpEngine");

class UpdatePlanner {

    build(localField, airtableField, differences) {

        const metadata = {};
        const mcp = [];

        const generatedOptions =
            FieldOptionsFactory.get(localField) || {};

        for (const difference of differences) {

            const value = this.getValue(
                difference,
                localField,
                generatedOptions
            );

            if (metadataEngine.supports(difference)) {

                this.assign(
                    metadata,
                    difference,
                    value
                );

                continue;

            }

            if (mcpEngine.supports(difference)) {

                mcp.push({

                    property: difference,

                    value

                });

            }

        }

        return {

            metadata,
            mcp

        };

    }

    getValue(
        difference,
        localField,
        generatedOptions
    ) {

        switch (difference) {

            case "description":

                return localField.description ?? null;

            case "options.precision":

                return generatedOptions.precision;

            case "options.icon":

                return generatedOptions.icon;

            case "options.color":

                return generatedOptions.color;

            case "options.choices":

                return generatedOptions.choices;

            default:

                return null;

        }

    }

    assign(
        payload,
        property,
        value
    ) {

        if (value === null || value === undefined) {
            return;
        }

        const parts = property.split(".");

        let target = payload;

        while (parts.length > 1) {

            const part = parts.shift();

            target[part] ??= {};

            target = target[part];

        }

        target[parts[0]] = value;

    }

    hasMetadataUpdates(result) {

        return Object.keys(
            result.metadata
        ).length > 0;

    }

    hasMcpUpdates(result) {

        return result.mcp.length > 0;

    }

    hasUpdates(result) {

        return (
            this.hasMetadataUpdates(result) ||
            this.hasMcpUpdates(result)
        );

    }

}

module.exports = new UpdatePlanner();