// One-off font-size scaler. Multiplies every font-size px value by SCALE.
// Run: node scripts/scale-fonts.js
// To revert: re-run with SCALE = 1/1.2

const fs = require("fs");
const path = require("path");

const SCALE = 1.2;
const round = (n) => Math.round(n);

function scaleFontSizeCss(content) {
  // font-size: Npx
  content = content.replace(/(font-size:\s*)(\d+)px/g, (_, pre, n) => `${pre}${round(parseInt(n, 10) * SCALE)}px`);
  // font-size: clamp(Apx, Xvw|vh|em|rem|%, Bpx)
  content = content.replace(
    /(font-size:\s*clamp\()(\d+)px,\s*([\d.]+)(vw|vh|em|rem|%),\s*(\d+)px(\))/g,
    (_, pre, a, mid, unit, b, post) => {
      const newMid = Math.round(parseFloat(mid) * SCALE * 100) / 100;
      return `${pre}${round(parseInt(a, 10) * SCALE)}px, ${newMid}${unit}, ${round(parseInt(b, 10) * SCALE)}px${post}`;
    },
  );
  return content;
}

function scaleTsx(content) {
  // fontSize: "Npx"
  content = content.replace(/(fontSize:\s*)"(\d+)px"/g, (_, pre, n) => `${pre}"${round(parseInt(n, 10) * SCALE)}px"`);
  // fontSize: N  (bare number, not "Npx", not 1.6 etc)
  content = content.replace(/(fontSize:\s*)(\d+)(?=[,}\s])/g, (_, pre, n) => `${pre}${round(parseInt(n, 10) * SCALE)}`);
  // clamp(...) inside jsx string templates
  content = content.replace(
    /clamp\((\d+)px,\s*([\d.]+)(vw|vh|em|rem|%),\s*(\d+)px\)/g,
    (_, a, mid, unit, b) => {
      const newMid = Math.round(parseFloat(mid) * SCALE * 100) / 100;
      return `clamp(${round(parseInt(a, 10) * SCALE)}px, ${newMid}${unit}, ${round(parseInt(b, 10) * SCALE)}px)`;
    },
  );
  return content;
}

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) out.push(p);
  }
}

const root = process.cwd();

// CSS
const cssPath = path.join(root, "app", "globals.css");
const origCss = fs.readFileSync(cssPath, "utf8");
const newCss = scaleFontSizeCss(origCss);
if (newCss !== origCss) {
  fs.writeFileSync(cssPath, newCss);
  console.log("Scaled app/globals.css");
}

// TSX/TS
const tsxFiles = [];
walk(path.join(root, "app"), tsxFiles);
walk(path.join(root, "components"), tsxFiles);
// Exclude the scaler itself
const excluded = new Set([path.resolve(__filename)]);

let changed = 0;
for (const f of tsxFiles) {
  if (excluded.has(path.resolve(f))) continue;
  const orig = fs.readFileSync(f, "utf8");
  const next = scaleTsx(orig);
  if (next !== orig) {
    fs.writeFileSync(f, next);
    changed++;
    console.log(`Scaled ${path.relative(root, f)}`);
  }
}
console.log(`TSX/TS files changed: ${changed}`);
