// series.js：整列编码（一次扫描，每个值只编一次）
import { encodeVarint, decodeVarint, unzigzag } from "./varint.js";

function badValue(value) {
  const error = new Error("值不是整数: " + String(value));
  error.code = "E_BAD_VALUE";
  return error;
}

export function encodeSeries(spec) {
  const values = (spec && spec.values) || [];
  const deltas = [];
  const sizes = [];
  let bytes_total = 0;
  let longest = 0;
  let longest_at = 0;
  let roundtrip = true;

  let prev = 0;
  let rebuilt = 0;
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (!Number.isInteger(value)) throw badValue(value);

    const delta = value - prev;
    const bytes = encodeVarint(delta);

    deltas.push(delta);
    sizes.push(bytes.length);
    bytes_total += bytes.length;
    if (bytes.length > longest) {
      longest = bytes.length;
      longest_at = i + 1;
    }

    rebuilt += unzigzag(decodeVarint(bytes).value);
    if (rebuilt !== value) roundtrip = false;

    prev = value;
  }

  return {
    deltas,
    sizes,
    bytes_total,
    longest,
    longest_at,
    roundtrip
  };
}
