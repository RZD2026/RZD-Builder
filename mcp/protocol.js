
const readline = require("readline");

class Protocol {

    constructor() {

        this.requestHandler = null;

    }

    onRequest(handler) {

        this.requestHandler = handler;

    }

    listen() {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });

        rl.on("line", async line => {

            if (!line.trim()) {
                return;
            }

            let request;

            try {

                request = JSON.parse(line);

            } catch {

                return;

            }

            if (this.requestHandler) {

                await this.requestHandler(request);

            }

        });

    }

    reply(id, result) {

        process.stdout.write(
            JSON.stringify({
                jsonrpc: "2.0",
                id,
                result
            }) + "\n"
        );

    }

    error(id, message) {

        process.stdout.write(
            JSON.stringify({
                jsonrpc: "2.0",
                id,
                error: {
                    code: -32000,
                    message
                }
            }) + "\n"
        );

    }

}

module.exports = Protocol;