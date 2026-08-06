const doctor = require("../doctor/doctor");

module.exports = {

    name: "Doctor",

    description: "Run compiler diagnostics",

    async execute(context) {

        context.build.diagnostics =
            await doctor(context);

    }

};
