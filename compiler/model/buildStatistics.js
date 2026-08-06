
function buildStatistics(input) {

    const context = input.model ? input : { model: input };
    const model = context.model;

    context.statistics = {

        tables: model.tables.length,

        lists: model.lists.length,

        fields: model.tables.reduce(
            (count, table) => count + table.fields.length,
            0
        )

    };

}

module.exports = buildStatistics;