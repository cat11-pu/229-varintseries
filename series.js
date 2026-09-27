// series.js：整列编码（基线：一律给空表）
import { encodeVarint } from "./varint.js";

export function encodeSeries(spec) {
  return { deltas: [], sizes: [], bytes_total: 0, longest: 0, longest_at: 0, roundtrip: true };
}
