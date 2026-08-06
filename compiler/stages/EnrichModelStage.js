const BaseStage = require("../BaseStage");
const enrichModel = require("../model/enrichModel");

class EnrichModelStage extends BaseStage {

    constructor() {

        super(
            "EnrichModel",
            "Resolve references and validate model"
        );

    }

    async execute(context) {

        await enrichModel(context);

    }

}

module.exports = new EnrichModelStage();
