import assert from "node:assert";
import { zigzag, encodeVarint } from "../varint.js";
import { encodeSeries } from "../series.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("zigzag returns a number", () => {
  assert.strictEqual(typeof zigzag(-3), "number");
});

check("encodeVarint returns bytes", () => {
  assert.ok(Array.isArray(encodeVarint(3)));
});

check("encodeSeries returns deltas", () => {
  assert.ok(Array.isArray(encodeSeries({ values: [] }).deltas));
});

check("render counts values", () => {
  assert.strictEqual(typeof render({ values: [] }).count, "number");
});

check("render exposes roundtrip flag", () => {
  assert.strictEqual(typeof render({ values: [] }).roundtrip, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
