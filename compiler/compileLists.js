
async function compileLists(input) {

    const model = input.model || input;

    return model.lists.map(list => ({

        id: list.id,

        name: list.name,

        description: list.description,

        values: list.values || []

    }));

}

module.exports = compileLists;