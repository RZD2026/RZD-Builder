
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

console.log("");

console.log("================================");
console.log("TEST GESLAAGD");
console.log("================================");