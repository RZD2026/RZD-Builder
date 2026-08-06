const fs = require("fs");
const path = require("path");

class StageLoader {

    static load(directory) {

        const stages = [];

        const files = fs.readdirSync(directory);

        for (const file of files) {

            if (!file.endsWith("Stage.js")) {
                continue;
            }

            const stage =
                require(path.join(directory, file));

            stages.push(stage);

        }

        stages.sort((a, b) => a.order - b.order);

        return stages;

    }

}

module.exports = StageLoader;
