require("dotenv").config();

const assert = require("assert");
const postService =
    require("./services/wordpressPostService");

const publisher =
    require("./services/wordpressPublisher");

(async () => {

    console.log("");
    console.log("================================");
    console.log("WordPress Page Service Mock Test");
    console.log("================================");
    console.log("");

    const campingAggregate = {
        id: "recCampingAggregate",
        naam: "Camping Bella Italia",
        type: "Camping",
        locatie: { land: "Italië", plaats: "Peschiera del Garda" },
        assessmentsets: [],
        campingBeoordelingen: [],
        voorzieningen: [],
        reizigerservaringen: [],
        opmerkingen: [],
        aandachtspunten: "Praktische informatie.",
        accommodatieLaag: {
            aangepasteAccommodatieAanwezig: "Onbekend"
        }
    };

    const originalFetch = global.fetch;
    let capturedUrl;
    let capturedOptions;
    let fetchCalls = 0;

    global.fetch = async (url, options) => {
        fetchCalls++;
        capturedUrl = url;
        capturedOptions = options;

        return {
            ok: true,
            status: options.method === "GET" ? 200 : 201,
            statusText: options.method === "GET" ? "OK" : "Created",
            headers: {
                get: name => name === "X-WP-TotalPages" ? "1" : null
            },
            json: async () => options.method === "GET"
                ? []
                : {
                    id: 123,
                    status: "draft"
                }
        };
    };

    try {

        const mapped = {
            status: "draft",
            meta: {
                rzd_camping_id: campingAggregate.id
            },
            content: "<p>Lokale testinhoud.</p>",
            title: campingAggregate.naam
        };
        const prepared =
            publisher.preparePage(mapped);

        assert.strictEqual(prepared.ready, true);
        assert.strictEqual(prepared.payload.title, campingAggregate.naam);
        assert.strictEqual(prepared.payload.status, "draft");
        assert.strictEqual(typeof prepared.payload.content, "string");
        assert.strictEqual(
            prepared.payload.meta.rzd_camping_id,
            campingAggregate.id
        );

        const result =
            await postService.create(prepared.payload);
        const payload = JSON.parse(capturedOptions.body);
        const expectedUrl =
            `${process.env.WORDPRESS_URL || ""}/wp-json/wp/v2/pages`;

        assert.strictEqual(fetchCalls, 2);
        assert.strictEqual(capturedUrl, expectedUrl);
        assert.strictEqual(capturedUrl.includes("/posts"), false);
        assert.strictEqual(capturedOptions.method, "POST");
        assert.strictEqual(capturedOptions.headers["Content-Type"], "application/json");
        assert.ok(capturedOptions.headers.Authorization);
        assert.deepStrictEqual(payload, prepared.payload);
        assert.strictEqual(payload.title, campingAggregate.naam);
        assert.strictEqual(payload.status, "draft");
        assert.strictEqual(payload.content, prepared.payload.content);
        assert.deepStrictEqual(payload.meta, prepared.payload.meta);
        assert.strictEqual(payload.content, mapped.content);
        assert.deepStrictEqual(payload.meta, mapped.meta);
        assert.ok(payload.content.includes("Lokale testinhoud."));
        assert.strictEqual(Object.prototype.hasOwnProperty.call(payload, "slug"), false);
        assert.strictEqual(Object.prototype.hasOwnProperty.call(payload, "featured_media"), false);
        assert.strictEqual(result.status, 201);

        fetchCalls = 0;

        await assert.rejects(
            () => postService.create({
                title: "Ongeldige pagina",
                status: "draft",
                content: "",
                meta: {}
            }),
            error =>
                error.code === "WORDPRESS_PAYLOAD_INVALID" &&
                error.errors.some(item => item.field === "content") &&
                error.errors.some(item => item.field === "meta.rzd_camping_id")
        );

        assert.strictEqual(fetchCalls, 0);

        fetchCalls = 0;

        await assert.rejects(
            () => postService.updateExisting(123, {
                title: "Ongeldige update",
                status: "draft",
                content: "<p>Update.</p>",
                meta: {}
            }),
            error =>
                error.code === "WORDPRESS_PAYLOAD_INVALID" &&
                error.errors.some(item => item.field === "meta.rzd_camping_id")
        );

        assert.strictEqual(fetchCalls, 0);

        fetchCalls = 0;
        const updateResult =
            await postService.updateExisting(123, prepared.payload);

        assert.strictEqual(updateResult.status, 201);
        assert.strictEqual(fetchCalls, 1);
        assert.strictEqual(capturedOptions.method, "POST");
        assert.strictEqual(
            JSON.parse(capturedOptions.body).status,
            "draft"
        );

        console.log("✓ WordPress Page-payload en /pages-endpoint zijn gemockt gecontroleerd.");
        console.log("✓ Geen echte externe request uitgevoerd.");

    } finally {

        global.fetch = originalFetch;

    }

})().catch(error => {
    console.error(error);
    process.exit(1);
});
