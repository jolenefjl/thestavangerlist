// Bumps font-weight by 100 wherever the context is DM Sans / Plus Jakarta Sans.
// CSS: bumps font-weight inside any rule block that contains --font-dm-sans
// TSX: bumps fontWeight adjacent to a fontFamily that includes dm-sans
// Run: node scripts/bump-sans-weights.js

const fs = require("fs");
const path = require("path");

const BUMP = 100;
const bump = (n) => Math.min(parseInt(n, 10) + BUMP, 900);

// ── CSS ────────────────────────────────────────────────────────────────────
function processCss(content) {
  // Split into rule-blocks by '}', carry the closing brace along.
  // For each block that mentions --font-dm-sans, bump font-weight values.
  return content.replace(
    /(\{[^{}]*font-family:[^{}]*--font-dm-sans[^{}]*\})/gs,
    (block) => block.replace(/(font-weight:\s*)(\d+)/g, (_, pre, w) => `${pre}${bump(w)}`)
  );
}

// Also bump the body rule which sets font-weight: 300 with font-family: dm-sans on separate lines
// The body rule block contains both
// (already handled by the regex above if the block has --font-dm-sans)

// ── TSX / TS ────────────────────────────────────────────────────────────────
// Pattern: somewhere within ~200 chars of fontFamily: "...dm-sans..." there's a fontWeight: N
// We'll do a two-pass: mark dm-sans style objects, then bump fontWeight within them.
function processTsx(content) {
  // Strategy: find style object boundaries that contain dm-sans, bump fontWeight inside
  // Simple approach: replace fontWeight within 300 chars of a dm-sans fontFamily mention
  return content.replace(
    /(fontFamily:\s*"[^"]*dm-sans[^"]*"(?:[^}]{0,400}?))(fontWeight:\s*)(\d+)/gs,
    (match, before, pre, w) => `${before}${pre}${bump(w)}`
  );
}

// ── File walking ────────────────────────────────────────────────────────────
function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.isFile() && /\.(tsx?|css)$/.test(entry.name)) out.push(p);
  }
}

const root = process.cwd();
const files = [];
walk(path.join(root, "app"), files);
walk(path.join(root, "components"), files);

let changed = 0;
for (const f of files) {
  const orig = fs.readFileSync(f, "utf8");
  const isCss = f.endsWith(".css");
  const next = isCss ? processCss(orig) : processTsx(orig);
  if (next !== orig) {
    fs.writeFileSync(f, next);
    changed++;
    console.log(`Bumped weights in ${path.relative(root, f)}`);
  }
}
console.log(`Done — ${changed} file(s) updated`);
