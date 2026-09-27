// app.js：渲染结果
import { zigzag, encodeVarint } from "./varint.js";
import { encodeSeries } from "./series.js";

export function render(spec) {
  const values = spec.values || [];
  const view = encodeSeries(spec);
  const sizes = view.sizes || [];
  return { deltas: view.deltas || [], sizes: sizes, bytes_total: view.bytes_total || 0,
           longest: view.longest || 0, longest_at: view.longest_at || 0,
           roundtrip: view.roundtrip !== false, count: values.length,
           tail: zigzag(-1), head_bytes: encodeVarint(values.length ? values[0] : 0).length };
}
