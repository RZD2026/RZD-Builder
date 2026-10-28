require("dotenv").config();

const campingReadService =
    require("../services/campingReadService");

const wordpressMapper =
    require("../services/wordpressMapper");

const wordpressPublisher =
    require("../services/wordpressPublisher");

const wordpressPostService =
    require("../services/wordpressPostService");


function parseArgs(args) {

    const positional =
        args.filter(value => !value.startsWith("--"));

    const flags =
        args.filter(value => value.startsWith("--"));

    const unknownFlags =
        flags.filter(value => value !== "--publish");

    if (unknownFlags.length > 0 || positional.length !== 1) {
        throw new Error(
            "Gebruik: node scripts/publishCamping.js <campingId> [--publish]"
        );
    }

    return {
        campingId: positional[0],
        publish: flags.includes("--publish")
    };

}


function preparePayload(campingAggregate, campingId) {

    const mapped =
        wordpressMapper.mapCampingAggregate(campingAggregate);

    const prepared =
        wordpressPublisher.preparePage(mapped);

    if (!prepared.ready) {
        throw new Error(
            "WordPress-payload is niet gereed voor verwerking."
        );
    }

    const payload = prepared.payload;

    if (payload?.meta?.rzd_camping_id !== campingId) {
        throw new Error(
            "WordPress-payload bevat geen exact overeenkomende rzd_camping_id."
        );
    }

    return payload;

}


async function run(args = process.argv.slice(2)) {

    const { campingId, publish } = parseArgs(args);

    const campingAggregate =
        await campingReadService.getCampingAggregate(campingId);

    const payload =
        preparePayload(campingAggregate, campingId);

    console.log(`Camping ${campingId} is voorbereid als WordPress-concept.`);

    if (!publish) {
        console.log("Dry-run: geen WordPress-aanroep uitgevoerd.");

        return {
            campingId,
            payload,
            published: false
        };
    }

    const result =
        await wordpressPostService.create(payload);

    if (!result || result.ok !== true) {
        const status =
            result?.status === undefined ? "onbekend" : result.status;
        const statusText =
            result?.statusText ? `: ${result.statusText}` : "";

        throw new Error(
            `WordPress-verwerking mislukt (status ${status})${statusText}.`
        );
    }

    if (result.reused) {
        console.log(
            `Bestaande WordPress-pagina ${result.body?.id || ""} wordt alleen hergebruikt; de pagina wordt niet automatisch bijgewerkt.`
        );
    } else {
        console.log(
            `Nieuwe WordPress-pagina aangemaakt met status ${result.status}.`
        );
    }

    return {
        campingId,
        payload,
        published: true,
        result
    };

}


if (require.main === module) {

    run().catch(error => {
        console.error(error.message);
        process.exitCode = 1;
    });

}


module.exports = {
    parseArgs,
    preparePayload,
    run
};
