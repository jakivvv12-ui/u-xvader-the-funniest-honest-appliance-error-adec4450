// Entry for make.fun "The Funniest Honest Appliance Error".
// The boiler finally tells the truth about the hot water.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "ERROR: Hot water unavailable. I heated it. You used it all. We are both disappointed.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

// The gate: a single line of 1-200 characters, not only whitespace.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (/\n|\r/.test(LINE)) {
  throw new Error("entry must be a single line");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Round-trip check: what was written is what lands on disk.
// The byte-length guard catches any silent encoding surprise
// (a BOM or a trailing newline added by the writer).
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LINE) {
  throw new Error("round-trip mismatch writing entry.txt");
}
if (Buffer.byteLength(roundTrip, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
  throw new Error("round-trip byte length mismatch");
}
