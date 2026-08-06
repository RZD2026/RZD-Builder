class CompilerContext {

    constructor(rawCanon) {

        this.rawCanon = rawCanon;

        this.model = null;

        this.lookup = {};

        this.statistics = {};

        this.errors = [];

        this.warnings = [];

    }

}

module.exports = CompilerContext;
