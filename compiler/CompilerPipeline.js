
const PipelineStage = require("./PipelineStage");

class CompilerPipeline {

    constructor() {

        this.stages = [];

    }

    add(stage) {

        this.stages.push(
            new PipelineStage(
                stage.name,
                stage.execute,
                stage
            )
        );

        return this;

    }

    async execute(context) {

        for (const stage of this.stages) {

            await stage.execute(context);

            if (context.errors.length > 0) {
                break;
            }

        }

        return context;

    }

}

module.exports = CompilerPipeline;