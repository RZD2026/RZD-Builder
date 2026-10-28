const assert = require("assert");

const publisher =
    require("./services/wordpressPublisher");

const postService =
    require("./services/wordpressPostService");


function buildPreparedPayload(id) {

    const mapped = {
        title: "Camping Test",
        status: "draft",
        meta: {
            rzd_camping_id: id
        },
        content: "<p>Lokale testinhoud.</p>"
    };

    const prepared =
        publisher.preparePage(mapped);

    assert.strictEqual(prepared.ready, true);

    return prepared.payload;

}


function response(body, totalPages = "1", ok = true, status = 200) {

    return {
        ok,
        status,
        statusText: ok ? "OK" : "Server Error",
        headers: {
            get: name => name === "X-WP-TotalPages"
                ? totalPages
                : null
        },
        json: async () => body
    };

}


async function runTests() {

    const originalFetch = global.fetch;

    const calls = [];

    try {

        calls.length = 0;
        global.fetch = async (url, options) => {
            calls.push({ kind: "fetch", url, options });

            if (options.method === "POST") {
                throw new Error("POST should not be called for an existing page.");
            }

            return response([
                {
                    id: 1554,
                    status: "draft",
                    meta: { rzd_camping_id: "recExisting" }
                }
            ]);
        };

        const existingPayload =
            buildPreparedPayload("recExisting");
        const existingResult =
            await postService.create(existingPayload);

        assert.strictEqual(existingResult.reused, true);
        assert.strictEqual(existingResult.body.id, 1554);
        assert.deepStrictEqual(
            calls.filter(call => call.kind === "fetch")
                .map(call => call.options.method),
            ["GET"]
        );

        calls.length = 0;
        global.fetch = async (url, options) => {
            calls.push({ kind: "fetch", url, options });

            if (options.method === "GET") {
                return response([]);
            }

            return response(
                {
                    id: 200,
                    status: "draft"
                },
                null,
                true,
                201
            );
        };

        const createdPayload =
            buildPreparedPayload("recNew");
        const createdResult =
            await postService.create(createdPayload);
        const createdCalls =
            calls.filter(call => call.kind === "fetch");
        const createdPost =
            createdCalls.find(call => call.options.method === "POST");

        assert.strictEqual(createdResult.status, 201);
        assert.strictEqual(createdCalls.length, 2);
        assert.deepStrictEqual(
            createdCalls.map(call => call.options.method),
            ["GET", "POST"]
        );
        assert.strictEqual(createdPost.url.endsWith("/pages"), true);
        assert.strictEqual(createdPayload.status, "draft");
        assert.strictEqual(
            createdPayload.meta.rzd_camping_id,
            "recNew"
        );
        assert.deepStrictEqual(
            JSON.parse(createdPost.options.body),
            createdPayload
        );

        calls.length = 0;
        global.fetch = async (url, options) => {
            calls.push({ kind: "fetch", url, options });
            return response([
                { id: 1, meta: { rzd_camping_id: "recDuplicate" } },
                { id: 2, meta: { rzd_camping_id: "recDuplicate" } }
            ]);
        };

        const duplicatePayload =
            buildPreparedPayload("recDuplicate");
        const duplicateResult =
            await postService.create(duplicatePayload);

        assert.strictEqual(duplicateResult.status, 409);
        assert.strictEqual(
            duplicateResult.body.code,
            "rzd_duplicate_camping_id"
        );
        assert.deepStrictEqual(
            calls.filter(call => call.kind === "fetch")
                .map(call => call.options.method),
            ["GET"]
        );

        calls.length = 0;
        global.fetch = async (url, options) => {
            calls.push({ kind: "fetch", url, options });
            return response(
                { message: "Lookup unavailable" },
                null,
                false,
                500
            );
        };

        const lookupErrorPayload =
            buildPreparedPayload("recLookupError");

        await assert.rejects(
            () => postService.create(lookupErrorPayload),
            /Lookup unavailable/
        );
        assert.deepStrictEqual(
            calls.filter(call => call.kind === "fetch")
                .map(call => call.options.method),
            ["GET"]
        );

        calls.length = 0;
        global.fetch = async (url, options) => {
            calls.push({ kind: "fetch", url, options });
            return response([]);
        };

        const invalidPaginationPayload =
            buildPreparedPayload("recInvalidPagination");

        global.fetch = async (url, options) => {
            calls.push({ kind: "fetch", url, options });
            return response([], null);
        };

        await assert.rejects(
            () => postService.create(invalidPaginationPayload),
            /invalid X-WP-TotalPages header/
        );
        assert.deepStrictEqual(
            calls.filter(call => call.kind === "fetch")
                .map(call => call.options.method),
            ["GET"]
        );

        console.log("WordPress CampingAggregate page reuse flow tests passed.");

    } finally {

        global.fetch = originalFetch;

    }

}


runTests().catch(error => {
    console.error(error);
    process.exit(1);
});
