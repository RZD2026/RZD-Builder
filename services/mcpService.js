
const { spawn } = require("child_process");
const readline = require("readline");

class McpService {

    constructor() {

        this.process = null;
        this.pending = new Map();
        this.requestId = 1;

    }

    async connect(command, args = [], options = {}) {

        if (this.process) {
            return;
        }

        this.process = spawn(command, args, {
            stdio: ["pipe", "pipe", "inherit"],
            ...options
        });

        const rl = readline.createInterface({
            input: this.process.stdout
        });

        rl.on("line", line => {

            if (!line.trim()) {
                return;
            }

            let message;

            try {

                message = JSON.parse(line);

            } catch {

                return;

            }

            if (!message.id) {
                return;
            }

            const pending = this.pending.get(message.id);

            if (!pending) {
                return;
            }

            this.pending.delete(message.id);

            if (message.error) {

                pending.reject(message.error);

            } else {

                pending.resolve(message.result);

            }

        });

    }

    async call(method, params = {}) {

        if (!this.process) {
            throw new Error("MCP is niet verbonden.");
        }

        const id = this.requestId++;

        const request = {
            jsonrpc: "2.0",
            id,
            method,
            params
        };

        return new Promise((resolve, reject) => {

            this.pending.set(id, {
                resolve,
                reject
            });

            this.process.stdin.write(
                JSON.stringify(request) + "\n"
            );

        });

    }

    async disconnect() {

        if (!this.process) {
            return;
        }

        this.process.kill();
        this.process = null;

    }

}

module.exports = new McpService();