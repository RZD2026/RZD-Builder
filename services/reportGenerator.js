const fs = require("fs");
const path = require("path");

class ReportGenerator {

    buildReport({

    metadata,

    summary,

    audit,

    synchronizationPlan = [],

    rollbackPlan = []

}) {

        return {

    metadata,

    summary,

    synchronizationPlan,

    rollbackPlan,

    audit

};

    }

    createTimestamp() {

        const now = new Date();

        const year = now.getFullYear();

        const month = String(now.getMonth() + 1).padStart(2, "0");

        const day = String(now.getDate()).padStart(2, "0");

        const hour = String(now.getHours()).padStart(2, "0");

        const minute = String(now.getMinutes()).padStart(2, "0");

        const second = String(now.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day}_${hour}-${minute}-${second}`;

    }

    createFileName(extension) {

        return `RZD_Builder_${this.createTimestamp()}.${extension}`;

    }

    buildJsonReport(report) {

        return JSON.stringify(
            report,
            null,
            4
        );

    }

    appendJsonBlock(title, object) {

        if (!object) {

            return "";

        }

        let md = "";

        md += `### ${title}\n\n`;

        md += "```json\n";

        md += JSON.stringify(
            object,
            null,
            4
        );

        md += "\n```\n\n";

        return md;

    }

    buildMarkdownReport(report) {

        let md = "";

        md += "# RZD Builder Report\n\n";

        md += "## Metadata\n\n";

        Object.entries(report.metadata).forEach(([key, value]) => {

            if (typeof value === "object") {

                return;

            }

            md += `- **${key}** : ${value}\n`;

        });

        md += "\n";

        if (report.metadata.environment) {

            md += "### Environment\n\n";

            Object.entries(report.metadata.environment).forEach(([key, value]) => {

                md += `- ${key} : ${value}\n`;

            });

            md += "\n";

        }

        md += "## Samenvatting\n\n";

    Object.entries(report.summary).forEach(([key, value]) => {

    md += `- ${key} : ${value}\n`;

});

        md += "\n";

        md += "## Synchronization Plan\n\n";

        if (report.synchronizationPlan.length === 0) {

            md += "_Geen acties._\n\n";

        } else {

            report.synchronizationPlan.forEach(item => {

                md += `### ${item.action.toUpperCase()}\n\n`;

                if (item.field) {

                    md += `**Veld:** ${item.field.name}\n\n`;

                }

                if (item.update) {

                    md += this.appendJsonBlock(
                        "Update",
                        item.update
                    );

                }

            });

        }

        md += "## Rollback Plan\n\n";

        if (report.rollbackPlan.length === 0) {

            md += "_Geen rollback nodig._\n\n";

        } else {

            report.rollbackPlan.forEach(item => {

                md += `### ${item.action.toUpperCase()}\n\n`;

                if (item.field) {

                    md += `**Veld:** ${item.field.name}\n\n`;

                }

                if (item.payload) {

                    md += this.appendJsonBlock(
                        "Rollback",
                        item.payload
                    );

                }

            });

        }

        md += "## Audit\n\n";

        if (report.audit.length === 0) {

            md += "_Geen auditregels._\n\n";

        } else {

            report.audit.forEach(record => {

                md += `### ${record.action.toUpperCase()}\n\n`;

                if (record.field) {

                    md += `**Veld:** ${record.field}\n\n`;

                }

                if (record.before) {

                    md += this.appendJsonBlock(
                        "Voor",
                        record.before
                    );

                }

                if (record.after) {

                    md += this.appendJsonBlock(
                        "Na",
                        record.after
                    );

                }

                if (record.message) {

                    md += `**Melding:** ${record.message}\n\n`;

                }

            });

        }

        return md;

    }

    saveJson(runContext) {
        
        const report =
            this.buildReport(runContext);

        const fileName =
            this.createFileName("json");

        const filePath = path.join(
            process.cwd(),
            "reports",
            fileName
        );

        fs.writeFileSync(
            filePath,
            this.buildJsonReport(report)
        );

        return filePath;

    }

    saveMarkdown(runContext) {

        const report =
    this.buildReport(runContext);

        const fileName =
            this.createFileName("md");

        const filePath = path.join(
            process.cwd(),
            "reports",
            fileName
        );

        fs.writeFileSync(
            filePath,
            this.buildMarkdownReport(report)
        );

        return filePath;

    }

}

module.exports = new ReportGenerator();

