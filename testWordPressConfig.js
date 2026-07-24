require("dotenv").config();
const config =
    require("./services/wordpressConfig");

console.log("");
console.log("================================");
console.log("WordPress Config Test");
console.log("================================");
console.log("");

const settings =
    config.get();

console.log("Configuratie");
console.log("--------------------------------");

console.dir(settings, {
    depth: null
});

console.log("");

console.log("Controle");
console.log("--------------------------------");

console.log(
    "URL                 :",
    typeof settings.url === "string"
);

console.log(
    "Username            :",
    typeof settings.username === "string"
);

console.log(
    "Application Password:",
    typeof settings.applicationPassword === "string"
);

console.log(
    "API                 :",
    settings.api === "/wp-json/wp/v2"
);

console.log(
    "Status              :",
    settings.defaultStatus === "draft"
);

console.log(
    "Timeout             :",
    settings.timeout === 10000
);

console.log("");

console.log("================================");
console.log("TEST GESLAAGD");
console.log("================================");