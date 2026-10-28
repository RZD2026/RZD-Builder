const assert = require("assert");

const publishCamping =
    require("./publishCamping");

const campingReadService =
    require("../services/campingReadService");

const wordpressPostService =
    require("../services/wordpressPostService");


function buildAggregate(id = "recCamping") {

    return {
        id,
        naam: "Camping Test",
        type: "Camping",
        locatie: {
            land: "Nederland",
            plaats: "Testplaats"
        },
        contact: {
            website: "https://example.test"
        },
        fotos: [],
        assessmentsets: [],
        campingBeoordelingen: [],
        voorzieningen: [],
        reizigerservaringen: [],
        opmerkingen: [],
        aandachtspunten: "",
        accommodatieLaag: {
            aangepasteAccommodatieAanwezig: "Onbekend"
        }
    };

}


async function runTests() {

    const originalGetCampingAggregate =
        campingReadService.getCampingAggregate;
    const originalCreate =
        wordpressPostService.create;
    const originalLog = console.log;
    const originalError = console.error;
    const output = [];
    let aggregateCalls = 0;
    let postCalls = 0;
    let succeeded = false;

    console.log = value => output.push(String(value));
    console.error = value => output.push(String(value));

    function resetOutput() {
        output.length = 0;
    }

    function resetCalls() {
        aggregateCalls = 0;
        postCalls = 0;
    }

    function assertOutputContains(text) {
        assert.ok(output.some(line => line.includes(text)),
            `Verwachte uitvoer ontbreekt: ${text}`);
    }

    function assertOutputExcludes(text) {
        assert.ok(!output.some(line => line.includes(text)),
            `Onverwachte uitvoer gevonden: ${text}`);
    }

    try {

        campingReadService.getCampingAggregate = async campingId => {
            aggregateCalls++;
            return buildAggregate(campingId);
        };

        wordpressPostService.create = async payload => {
            postCalls++;
            return {
                ok: true,
                status: 201,
                body: { id: 200, status: "draft" }
            };
        };

        resetCalls();
        resetOutput();
        const dryRun =
            await publishCamping.run(["recDryRun"]);

        assert.strictEqual(dryRun.published, false);
        assert.strictEqual(dryRun.payload.meta.rzd_camping_id, "recDryRun");
        assert.strictEqual(aggregateCalls, 1);
        assert.strictEqual(postCalls, 0);
        assertOutputContains("geen WordPress-aanroep");
        console.log("PASS dry-run doet geen WordPress-aanroep");

        resetCalls();
        resetOutput();

        const published =
            await publishCamping.run(["recPublish", "--publish"]);

        assert.strictEqual(published.published, true);
        assert.strictEqual(published.result.status, 201);
        assert.strictEqual(aggregateCalls, 1);
        assert.strictEqual(postCalls, 1);
        assertOutputContains("Nieuwe WordPress-pagina aangemaakt");
        console.log("PASS --publish roept de postservice aan");

        resetCalls();
        resetOutput();
        campingReadService.getCampingAggregate = async () =>
            buildAggregate("recOther");

        await assert.rejects(
            () => publishCamping.run(["recMismatch"]),
            /exact overeenkomende rzd_camping_id/
        );
        assert.strictEqual(postCalls, 0);
        console.log("PASS afwijkend camping-ID stopt vóór de postservice");

        resetCalls();
        resetOutput();
        campingReadService.getCampingAggregate = async campingId =>
            buildAggregate(campingId);
        wordpressPostService.create = async () => {
            postCalls++;
            return {
                ok: true,
                status: 200,
                statusText: "Existing",
                body: { id: 201 },
                reused: true
            };
        };

        await publishCamping.run(["recExisting", "--publish"]);
        assert.strictEqual(postCalls, 1);
        assertOutputContains("alleen hergebruikt");
        assertOutputContains("niet automatisch bijgewerkt");
        assertOutputExcludes("aangemaakt");
        console.log("PASS bestaande pagina wordt als hergebruik gemeld");

        resetCalls();
        resetOutput();
        wordpressPostService.create = async () => {
            postCalls++;
            return {
                ok: true,
                status: 201,
                statusText: "Created",
                body: { id: 202 }
            };
        };

        await publishCamping.run(["recCreated", "--publish"]);
        assert.strictEqual(postCalls, 1);
        assertOutputContains("Nieuwe WordPress-pagina aangemaakt");
        console.log("PASS succesvolle nieuwe pagina wordt als aangemaakt gemeld");

        resetCalls();
        resetOutput();
        wordpressPostService.create = async () => {
            postCalls++;
            return {
                ok: false,
                status: 409,
                statusText: "Conflict",
                body: {
                    message: "Interne fouttekst die niet mag worden gelogd"
                }
            };
        };

        await assert.rejects(
            () => publishCamping.run(["recFailed", "--publish"]),
            /WordPress-verwerking mislukt \(status 409\): Conflict/
        );
        assert.strictEqual(postCalls, 1);
        assertOutputExcludes("aangemaakt");
        assertOutputExcludes("Interne fouttekst");
        console.log("PASS ok:false wordt een veilige fout zonder succesmelding");

        resetOutput();
        wordpressPostService.create = async () => {
            throw new Error("WordPress-service unavailable");
        };

        await assert.rejects(
            () => publishCamping.run(["recServiceError", "--publish"]),
            /WordPress-service unavailable/
        );
        assertOutputExcludes("aangemaakt");
        console.log("PASS fouten uit de WordPress-service worden doorgegeven");

        campingReadService.getCampingAggregate = async () => {
            throw new Error("Aggregate unavailable");
        };

        await assert.rejects(
            () => publishCamping.run(["recAggregateError"]),
            /Aggregate unavailable/
        );
        console.log("PASS fouten uit de aggregate-opvraag worden doorgegeven");

        for (const args of [[], ["recOne", "recTwo"], ["recOne", "--invalid"]]) {
            assert.throws(
                () => publishCamping.parseArgs(args),
                /Gebruik: node scripts\/publishCamping\.js/
            );
        }
        console.log("PASS ontbrekende en ongeldige argumenten worden geweigerd");

        succeeded = true;

    } finally {

        campingReadService.getCampingAggregate = originalGetCampingAggregate;
        wordpressPostService.create = originalCreate;
        console.log = originalLog;
        console.error = originalError;

        if (succeeded) {
            originalLog("publishCamping CLI tests passed.");
        }

    }

}


runTests().catch(error => {
    console.error(error);
    process.exit(1);
});
