
const preflight = require("./services/preflight");

const result = preflight.run();

preflight.print(result);

console.log("");
console.log("================================");
console.log("TEST GESLAAGD");
console.log("================================");