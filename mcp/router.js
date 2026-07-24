
const updateChoices = require("../services/mcpHandlers/updateChoices");

class Router {

    async handle(request) {

        const { method, params } = request;

        switch (method) {

            case "airtable.field.updateChoices":

                return await updateChoices.execute(params);

            default:

                throw new Error(
                    `Onbekende MCP-methode: ${method}`
                );

        }

    }

}

module.exports = new Router();