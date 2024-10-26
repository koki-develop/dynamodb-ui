const fs = require("node:fs");
const path = require("node:path");

const bin = path.resolve(__dirname, "./dist/server/server.js");
const shebang = "#!/usr/bin/env node\n\n";

const data = fs.readFileSync(bin, "utf8");
fs.writeFileSync(bin, shebang + data, "utf8");
