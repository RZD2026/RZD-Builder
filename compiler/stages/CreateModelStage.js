const BaseStage = require("../BaseStage");
const createModel = require("../model/createModel");

class CreateModelStage extends BaseStage {

    constructor() {

        super(
            "CreateModel",
            "Create compiler model",
            100
        );

    }

    async execute(context) {

        context.model = await createModel(context);

    }

}

module.exports = new CreateModelStage();
