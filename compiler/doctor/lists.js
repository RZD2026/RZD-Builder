
function lists(model) {

    const report = {

        emptyLists: [],
        unusedLists: []

    };

    const usedLists = new Set();

    for (const table of model.tables) {

        for (const field of table.fields) {

            if (field.list) {
                usedLists.add(field.list);
            }

        }

    }

    for (const list of model.lists) {

        if (!list.values || list.values.length === 0) {

            report.emptyLists.push({
                list: list.id
            });

        }

        if (!usedLists.has(list.id)) {

            report.unusedLists.push({
                list: list.id
            });

        }

    }

    return report;

}

module.exports = lists;