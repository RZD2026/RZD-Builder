
class BaseStage {

    constructor(name, description = "", order = 1000) {

        this.name = name;
        this.description = description;
        this.order = order;

    }

    async execute(context) {

        throw new Error(
            `${this.name}: execute() not implemented`
        );

    }

}

module.exports = BaseStage;