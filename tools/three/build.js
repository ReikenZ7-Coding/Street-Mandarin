// node build.js → ../../vendor/three-street.js (one minified ES module, so the app needs no CDN and works offline)
const path = require("path");
require("esbuild").buildSync({
  entryPoints: [path.join(__dirname, "entry.js")], bundle: true, minify: true, format: "esm", target: "es2020",
  outfile: path.resolve(__dirname, "../../vendor/three-street.js"), legalComments: "eof", logLevel: "info",
});
