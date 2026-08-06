const comparisonService = require("../../services/comparisonService");
const synchronizationPlan = require("../../services/synchronizationPlan");
const rollbackPlanner = require("../../services/rollbackPlanner");
const reportFormatter = require("../../services/reportFormatter");

class BuilderWorkflow {

    static async run(bootstrap) {

        const {
            moduleName,
            context
        } = bootstrap;

        console.log("");
        console.log(`Controle van module '${moduleName}'...`);

        const results =
            comparisonService.compareModule(context);

        const plan =
            synchronizationPlan.build(results);

        const rollbackPlan =
            rollbackPlanner.build(plan);

        reportFormatter.printModuleComparison(results);

        const summary = {
            existing: results.filter(r => r.action !== "create").length,
            missing: results.filter(r => r.action === "create").length,
            changed: results.filter(r => r.action === "update").length
        };

        return {
            results,
            plan,
            rollbackPlan,
            summary
        };

    }

}

module.exports = BuilderWorkflow;
