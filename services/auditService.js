
const crypto = require("crypto");

class AuditService {

    constructor() {

        this.startRun();

    }

    startRun() {

        this.runId = crypto.randomUUID();

        this.startedAt = new Date();

        this.records = [];

    }

    finishRun() {

        this.finishedAt = new Date();

    }

    add(record) {

        this.records.push({

            runId: this.runId,

            timestamp: new Date().toISOString(),

            ...record

        });

    }

    getRunId() {

        return this.runId;

    }

    getRecords() {

        return this.records;

    }

    count() {

        return this.records.length;

    }

    clear() {

        this.startRun();

    }

    getSummary() {

        const summary = {

            create: 0,
            update: 0,
            skip: 0,
            warning: 0,
            error: 0

        };

        for (const record of this.records) {

            switch (record.action) {

                case "create":
                    summary.create++;
                    break;

                case "update":
                    summary.update++;
                    break;

                case "skip":
                    summary.skip++;
                    break;

                case "warning":
                    summary.warning++;
                    break;

                case "error":
                    summary.error++;
                    break;

            }

        }

        return summary;

    }

    printSummary() {

        const summary = this.getSummary();

        console.log("");
        console.log("================================");
        console.log("Audit Samenvatting");
        console.log("================================");
        console.log("");

        console.log(`Run ID       : ${this.runId}`);
        console.log(`Create       : ${summary.create}`);
        console.log(`Update       : ${summary.update}`);
        console.log(`Skip         : ${summary.skip}`);
        console.log(`Warnings     : ${summary.warning}`);
        console.log(`Errors       : ${summary.error}`);

        if (this.startedAt && this.finishedAt) {

            const duration =
                (this.finishedAt - this.startedAt) / 1000;

            console.log(
                `Duur         : ${duration.toFixed(2)} sec`
            );

        }

        console.log("");

    }

}

module.exports = new AuditService();