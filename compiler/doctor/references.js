
function references(input) {

    const context = input.model ? input : { model: input };

    const report = {

        unknownLists: []

    };

    for (const warning of context.warnings) {

        switch (warning.type) {

            case "unknown-list":
                report.unknownLists.push(warning);
                break;

        }

    }

    return report;

}

module.exports = references;