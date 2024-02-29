const fs = require("fs");
const path = require("path");

const bin = path.resolve(__dirname, "./dist/server/main.js");
const shebang = "#!/usr/bin/env node\n\n";

const data = fs.readFileSync(bin, "utf8");
fs.writeFileSync(bin, shebang + data, "utf8");
