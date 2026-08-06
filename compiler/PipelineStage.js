
class PipelineStage {

    constructor(name, action, options = {}) {

        this.name = name;
        this.action = action;

        this.description = options.description || "";
        this.critical = options.critical !== false;

    }

    async execute(context) {

        console.log("Stage:", this.name);

        await this.action(context);

    }

}

module.exports = PipelineStage;