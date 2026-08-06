
function checkUnknownLists(input) {

    const context = input.model ? input : { model: input };

    return context.warnings.filter(warning =>
        warning.type === "unknown-list"
    );

}

module.exports = checkUnknownLists;