
function buildStatistics(input) {

    const model = input.model || input;

    model.statistics = {

        tables: model.tables.length,

        lists: model.lists.length,

        fields: model.tables.reduce(
            (count, table) => count + table.fields.length,
            0
        )

    };

}

module.exports = buildStatistics;