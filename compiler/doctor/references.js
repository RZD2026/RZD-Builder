
function references(model) {

    const report = {

        unknownLists: []

    };

    for (const warning of model.warnings) {

        switch (warning.type) {

            case "unknown-list":
                report.unknownLists.push(warning);
                break;

        }

    }

    return report;

}

module.exports = references;