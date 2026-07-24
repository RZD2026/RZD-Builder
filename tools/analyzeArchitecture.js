
const fs = require("fs");
const path = require("path");

const root = process.cwd();

const ignore = new Set([
    "node_modules",
    ".git"
]);

const files = [];

function walk(dir) {

    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {

        if (ignore.has(item.name)) continue;

        const full = path.join(dir, item.name);

        if (item.isDirectory()) {

            walk(full);

        } else if (item.name.endsWith(".js")) {

            files.push(full);

        }
    }
}

walk(root);

const graph = {};

for (const file of files) {

    const relative = path.relative(root, file).replace(/\\/g, "/");

    const text = fs.readFileSync(file, "utf8");

    const requires = [];

    const regex = /require\s*\(\s*['"](.+?)['"]\s*\)/g;

    let match;

    while ((match = regex.exec(text)) !== null) {

        requires.push(match[1]);
    }

    graph[relative] = requires;
}

console.log("");
console.log("================================");
console.log("RZD BUILDER ARCHITECTURE");
console.log("================================");
console.log("");

Object.entries(graph)
    .sort()
    .forEach(([file, deps]) => {

        console.log(file);

        if (!deps.length) {

            console.log("   (geen dependencies)");

        } else {

            deps.forEach(dep => console.log("   -> " + dep));
        }

        console.log("");
    });