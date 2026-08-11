const pointMappings =
    require("./pointMappings");

function get(contentId) {
    return pointMappings[contentId] || null;
}

function getAll() {
    return Object.entries(pointMappings).map(
        ([contentId, mapping]) => ({
            contentId,
            ...mapping
        })
    );
}

module.exports = {
    get,
    getAll
};