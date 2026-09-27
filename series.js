// series.js：整列编码（一次扫描，每个值只编一次）
import { encodeVarint, decodeVarint } from "./varint.js";

function badValueError() {
  const error = new Error("values 必须全部是整数");
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
  let previous = 0;
  let accumulated = 0;
  let roundtrip = true;

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw badValueError();
    }
    const delta = value - previous;
    previous = value;
    deltas.push(delta);

    const bytes = encodeVarint(delta);
    sizes.push(bytes.length);
    bytes_total += bytes.length;
    if (bytes.length > longest) {
      longest = bytes.length;
      longest_at = index + 1;
    }

    accumulated += decodeVarint(bytes);
    if (accumulated !== value) {
      roundtrip = false;
    }
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
