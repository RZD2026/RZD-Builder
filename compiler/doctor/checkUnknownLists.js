
function checkUnknownLists(model) {

    return model.warnings.filter(warning =>
        warning.type === "unknown-list"
    );

}

module.exports = checkUnknownLists;