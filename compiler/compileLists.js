
async function compileLists(canon) {

    const lists = [];

    for (const list of (canon.lists || [])) {

        const data = list.data;

        lists.push({

            id: data.id,

            name: data.name,

            description: data.description,

            values: data.values || []

        });

    }

    return lists;

}

module.exports = compileLists;