// Shared by every browser test: finds Playwright and points at the app's index.html
const path = require('path'), { pathToFileURL } = require('url');
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
module.exports = pw;
module.exports.APP = pathToFileURL(path.resolve(__dirname, '../../index.html')).href;
