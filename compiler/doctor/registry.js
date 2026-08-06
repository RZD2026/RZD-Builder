
function registry(model) {

    const report = {

        missingRegistry: [],
        duplicateRegistryIds: []

    };

    if (!model.registry || model.registry.length === 0) {

        report.missingRegistry.push({
            message: "No registry entries found."
        });

        return report;

    }

    const ids = new Set();

    for (const item of model.registry) {

        if (ids.has(item.id)) {

            report.duplicateRegistryIds.push({
                id: item.id
            });

            continue;

        }

        ids.add(item.id);

    }

    return report;

}

module.exports = registry;