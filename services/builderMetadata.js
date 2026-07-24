
const os = require("os");

class BuilderMetadata {

    create(options = {}) {

        return {

            builder: "RZD Builder",

            version: "2.0.0-rc1",

            module: options.module || "Onbekend",

            table: options.table || "Onbekend",

            runId: options.runId || null,

            startedAt: new Date().toISOString(),

            finishedAt: null,

            duration: null,

            dryRun: options.dryRun === true,

            environment: {

                node: process.version,

                platform: process.platform,

                architecture: process.arch,

                hostname: os.hostname(),

                user: os.userInfo().username

            }

        };

    }

    finish(metadata) {

        const finishedAt = new Date();

        metadata.finishedAt = finishedAt.toISOString();

        if (metadata.startedAt) {

            const startedAt = new Date(metadata.startedAt);

            metadata.duration = Number(

                (
                    (finishedAt - startedAt) / 1000
                ).toFixed(3)

            );

        }

        return metadata;

    }

    print(metadata) {

        console.log("");
        console.log("================================");
        console.log("Builder Metadata");
        console.log("================================");
        console.log("");

        console.log(`Builder      : ${metadata.builder}`);
        console.log(`Versie       : ${metadata.version}`);
        console.log(`Module       : ${metadata.module}`);
        console.log(`Tabel        : ${metadata.table}`);
        console.log(`Run ID       : ${metadata.runId}`);
        console.log(`Start        : ${metadata.startedAt}`);
        console.log(`Einde        : ${metadata.finishedAt}`);
        console.log(`Duur         : ${metadata.duration} sec`);
        console.log(`Dry Run      : ${metadata.dryRun}`);

        console.log("");
        console.log("Environment");
        console.log("--------------------------------");

        console.log(`Node         : ${metadata.environment.node}`);
        console.log(`Platform     : ${metadata.environment.platform}`);
        console.log(`Architectuur : ${metadata.environment.architecture}`);
        console.log(`Hostname     : ${metadata.environment.hostname}`);
        console.log(`Gebruiker    : ${metadata.environment.user}`);

        console.log("");

    }

}

module.exports = new BuilderMetadata();