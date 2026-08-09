class SchemaWriteEngine {

    buildPlan(comparisonResults) {

        if (!Array.isArray(comparisonResults)) {
            throw new Error(
                "SchemaWriteEngine: comparisonResults moet een array zijn."
            );
        }

        const plan = [];

        const creates =
            comparisonResults.filter(
                result => result.action === "create"
            );

        const updates =
            comparisonResults.filter(
                result => result.action === "update"
            );

        const skips =
            comparisonResults.filter(
                result => result.action === "skip"
            );

        const orderedCreates =
            this.orderTableCreates(creates);

        for (const result of skips) {

            plan.push({
                action: "skip",
                table: result.table
            });

        }

        for (const result of orderedCreates) {

            plan.push({
                action: "createTable",
                table: result.table,
                dependsOn: this.getDependencies(
                    result.desired
                ),
                fields: (result.desired.fields || [])
                    .map(field =>
                        this.buildFieldPlan(
                            result.table,
                            field
                        )
                    )
            });

        }

        for (const result of updates) {

            for (const difference of result.differences) {

                if (difference.action === "create") {

                    plan.push({
                        action: "createField",
                        ...this.buildFieldPlan(
                            result.table,
                            difference.field
                        )
                    });

                    continue;
                }

                if (difference.action === "update") {

                    plan.push({
                        action: "updateField",
                        table: result.table,
                        field: difference.field,
                        airtableField:
                            difference.airtableField,
                        differences:
                            difference.differences
                    });

                }

            }

        }

        return plan;

    }

    orderTableCreates(results) {

        const priority = {
            "Content Modules": 10,
            "Beoordelingspunten": 20,
            "Accommodatie Beoordelingen": 30
        };

        return [...results].sort(
            (a, b) =>
                (priority[a.table] || 100) -
                (priority[b.table] || 100)
        );

    }

    getDependencies(table) {

        const dependencies = [];

        for (const field of table.fields || []) {

            if (field.linkedTable) {

                if (
                    !dependencies.includes(
                        field.linkedTable
                    )
                ) {

                    dependencies.push(
                        field.linkedTable
                    );

                }

            }

        }

        return dependencies;

    }

    buildFieldPlan(tableName, field) {

        const plan = {
            table: tableName,
            field: field.name,
            type: field.type
        };

        if (field.choices) {

            plan.choices = field.choices;

        }

        if (field.linkedTable) {

            plan.link = {
                linkedTable: field.linkedTable
            };

        }

        if (field.options) {

            plan.options = field.options;

        }

        if (field.description) {

            plan.description =
                field.description;

        }

        return plan;

    }

    summarize(plan) {

        const summary = {
            createTable: 0,
            createField: 0,
            updateField: 0,
            skip: 0
        };

        for (const item of plan) {

            if (
                Object.prototype.hasOwnProperty.call(
                    summary,
                    item.action
                )
            ) {

                summary[item.action]++;

            }

        }

        return summary;

    }

}

module.exports = new SchemaWriteEngine();