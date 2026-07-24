
const moduleRunner = require("../services/moduleRunner");

(async () => {

    const build = {

        modules: [

            {
                id: "accommodations"
            }

        ]

    };

    try {

        await moduleRunner.run(build, {
            dryRun: true
        });

        console.log("");
        console.log("✓ ModuleRunner succesvol getest.");
        console.log("");

    } catch (err) {

        console.error(err);

    }

})();