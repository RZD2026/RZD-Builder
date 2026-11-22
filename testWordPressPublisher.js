
const assert = require("assert");

const publisher =
    require("./services/wordpressPublisher");

console.log("");
console.log("================================");
console.log("WordPress Publisher Test");
console.log("================================");
console.log("");

const post = {

    title: "Camping Bella Italia",

    status: "draft",

    meta: {

        land: "Italië",

        plaats: "Peschiera del Garda"

    }

};

const result =
    publisher.prepare(post);

console.log("Input");
console.log("--------------------------------");

console.dir(post, {
    depth: null
});

console.log("");

console.log("Output");
console.log("--------------------------------");

console.dir(result, {
    depth: null
});

console.log("");

console.log("Controle");
console.log("--------------------------------");

console.log(
    "Ready   :",
    result.ready === true
);

console.log(
    "Payload :",
    result.payload.title === post.title
);

console.log(
    "Meta    :",
    result.payload.meta.land === post.meta.land
);

assert.strictEqual(result.ready, true);
assert.deepStrictEqual(result.errors, []);
assert.strictEqual(result.payload.title, post.title);
assert.strictEqual(result.payload.meta.land, post.meta.land);

const invalidGeneric =
    publisher.prepare({
        title: "",
        status: "publish",
        meta: []
    });

assert.strictEqual(invalidGeneric.ready, false);
assert.strictEqual(invalidGeneric.payload.title, "");
assert.ok(
    invalidGeneric.errors.some(error => error.field === "title")
);
assert.ok(
    invalidGeneric.errors.some(error => error.field === "status")
);
assert.ok(
    invalidGeneric.errors.some(error => error.field === "meta")
);

const validPage =
    publisher.preparePage({
        title: "Camping Page",
        status: "draft",
        content: "<p>Lokale inhoud.</p>",
        meta: {
            rzd_camping_id: "recPublisher"
        }
    });

assert.strictEqual(validPage.ready, true);
assert.deepStrictEqual(validPage.errors, []);

const invalidPage =
    publisher.preparePage({
        title: "Camping Page",
        status: "draft",
        content: "",
        meta: {}
    });

assert.strictEqual(invalidPage.ready, false);
assert.ok(
    invalidPage.errors.some(error => error.field === "content")
);
assert.ok(
    invalidPage.errors.some(error => error.field === "meta.rzd_camping_id")
);

console.log("");

console.log("================================");
console.log("TEST GESLAAGD");
console.log("================================");