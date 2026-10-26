const assert = require("assert");

const publisher =
    require("./services/wordpressPublisher");

const postService =
    require("./services/wordpressPostService");


function buildPayload(id = "recCamping") {

    return publisher.preparePage({
        status: "draft",
        meta: {
            rzd_camping_id: id
        },
        content: "<p>Lokale testinhoud.</p>"
    }).payload;

}


async function runTests() {

    const originalFetch = global.fetch;
    const calls = [];

    function assertLookupRequest(call, expectedPage) {

        const requestUrl = new URL(call.url, "http://localhost");

        assert.strictEqual(call.options.method, "GET");
        assert.strictEqual(requestUrl.searchParams.get("context"), "edit");
        assert.strictEqual(requestUrl.searchParams.get("status"), "any");
        assert.strictEqual(requestUrl.searchParams.get("per_page"), "100");
        assert.strictEqual(requestUrl.searchParams.get("page"), String(expectedPage));

    }

    try {

        global.fetch = async (url, options) => {
            calls.push({ url, options });

            if (options.method === "GET") {
                return {
                    ok: true,
                    status: 200,
                    statusText: "OK",
                    headers: {
                        get: name => name === "X-WP-TotalPages" ? "2" : null
                    },
                    json: async () => calls.length === 2
                        ? [{
                            id: 1554,
                            status: "draft",
                            meta: { rzd_camping_id: "recExisting" }
                        }]
                        : []
                };
            }

            throw new Error("POST should not be called for an existing page.");
        };

        const existing =
            await postService.create(buildPayload("recExisting"));

        assert.strictEqual(existing.reused, true);
        assert.strictEqual(existing.body.id, 1554);
        assert.strictEqual(calls.length, 2);
        assertLookupRequest(calls[0], 1);
        assertLookupRequest(calls[1], 2);

        calls.length = 0;
        global.fetch = async (url, options) => {
            calls.push({ url, options });

            if (options.method === "GET") {
                return {
                    ok: true,
                    status: 200,
                    statusText: "OK",
                    headers: {
                        get: name => name === "X-WP-TotalPages" ? "1" : null
                    },
                    json: async () => []
                };
            }

            return {
                ok: true,
                status: 201,
                statusText: "Created",
                json: async () => ({ id: 200 })
            };
        };

        const created =
            await postService.create(buildPayload("recNew"));

        assert.strictEqual(created.status, 201);
        assert.deepStrictEqual(
            calls.map(call => call.options.method),
            ["GET", "POST"]
        );
        assert.strictEqual(
            JSON.parse(calls[1].options.body).meta.rzd_camping_id,
            "recNew"
        );

        calls.length = 0;
        global.fetch = async (url, options) => {
            calls.push({ url, options });

            return {
                ok: true,
                status: 200,
                statusText: "OK",
                headers: {
                    get: name => name === "X-WP-TotalPages" ? "1" : null
                },
                json: async () => [
                    { id: 1, meta: { rzd_camping_id: "recDuplicate" } },
                    { id: 2, meta: { rzd_camping_id: "recDuplicate" } }
                ]
            };
        };

        const duplicate =
            await postService.create(buildPayload("recDuplicate"));

        assert.strictEqual(duplicate.status, 409);
        assert.strictEqual(duplicate.body.code, "rzd_duplicate_camping_id");
        assert.deepStrictEqual(duplicate.body.pageIds, [1, 2]);
        assert.strictEqual(calls.length, 1);

        const lookupErrorMethods = [];
        global.fetch = async (url, options) => {
            lookupErrorMethods.push(options.method);

            return {
                ok: false,
                status: 500,
                statusText: "Server Error",
                json: async () => ({ message: "Lookup unavailable" })
            };
        };

        await assert.rejects(
            () => postService.create(buildPayload("recLookupError")),
            /Lookup unavailable/
        );
        assert.strictEqual(lookupErrorMethods.length, 1);
        assert.deepStrictEqual(lookupErrorMethods, ["GET"]);

        const invalidPaginationMethods = [];
        global.fetch = async (url, options) => {
            invalidPaginationMethods.push(options.method);

            return {
                ok: true,
                status: 200,
                statusText: "OK",
                headers: {
                    get: () => undefined
                },
                json: async () => []
            };
        };

        await assert.rejects(
            () => postService.create(buildPayload("recInvalidPagination")),
            /invalid X-WP-TotalPages header/
        );
        assert.strictEqual(invalidPaginationMethods.length, 1);
        assert.deepStrictEqual(invalidPaginationMethods, ["GET"]);

        const genericPayload = {
            title: "Legacy page",
            status: "draft",
            meta: {}
        };

        let genericPostCalled = false;
        global.fetch = async (url, options) => {
            genericPostCalled = options.method === "POST";
            return {
                ok: true,
                status: 201,
                statusText: "Created",
                json: async () => ({ id: 300 })
            };
        };

        const generic =
            await postService.create(genericPayload);

        assert.strictEqual(genericPostCalled, true);
        assert.strictEqual(generic.status, 201);

        const compatibilityPayload = { title: "Compatibility" };
        assert.deepStrictEqual(
            publisher.prepare(compatibilityPayload),
            publisher.preparePage(compatibilityPayload)
        );

        console.log("WordPress page reuse tests passed.");

    } finally {

        global.fetch = originalFetch;

    }

}


runTests().catch(error => {
    console.error(error);
    process.exit(1);
});