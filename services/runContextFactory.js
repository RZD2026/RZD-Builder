
class RunContextFactory {

    create({

        metadata,

        auditSummary,

        audit,

        synchronizationPlan = [],

        rollbackPlan = []

    }) {

               return {

            metadata,

            summary: auditSummary,

            synchronizationPlan,

            rollbackPlan,

            audit

        };

    }

}

module.exports = new RunContextFactory();