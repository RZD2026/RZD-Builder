
function printGroup(title, items, formatter) {

    if (!items || items.length === 0) {
        return;
    }

    console.log("");

    if (title) {
        console.log(title);
    }

    for (const item of items) {
        console.log(formatter(item));
    }

}

module.exports = {

    printGroup

};