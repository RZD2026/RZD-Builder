
class Runtime {

    constructor(options = {}) {

        this.options = options;

        this.startTime = new Date();

        this.statistics = {

            created: 0,
            updated: 0,
            skipped: 0,
            warnings: 0,
            errors: 0

        };

        this.metadata = null;

        this.audit = null;

    }

    finish() {

        this.endTime = new Date();

        this.duration =
            this.endTime - this.startTime;

    }

}

module.exports = Runtime;