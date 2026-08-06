const reportFormatter = require("./services/reportFormatter");

const report = [

    {
        property: "description",
        local: "Lokale beschrijving",
        remote: "Andere beschrijving"
    },

    {
        property: "options.precision",
        local: 1,
        remote: 0
    }

];

reportFormatter.createDifferenceReport(
    "Description Test",
    report
);