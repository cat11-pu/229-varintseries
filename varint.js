// varint.js：折返与变长编码
export function zigzag(value) {
  if (!Number.isInteger(value)) {
    const error = new Error("值不是整数: " + String(value));
    error.code = "E_BAD_VALUE";
    throw error;
  }
  return value >= 0 ? value * 2 : -value * 2 - 1;
}

export function encodeVarint(value) {
  let rest = zigzag(value);
  const bytes = [];
  while (rest >= 0x80) {
    bytes.push((rest % 128) + 0x80);
    rest = Math.floor(rest / 128);
  }
  bytes.push(rest);
  return bytes;
}

export function decodeVarint(bytes) {
  let result = 0;
  let shift = 1;
  let length = 0;
  for (const byte of bytes) {
    length += 1;
    result += (byte & 0x7f) * shift;
    if ((byte & 0x80) === 0) return { value: result, length };
    shift *= 128;
  }
  throw new Error("变长字节流缺少终止字节");
}

export function unzigzag(value) {
  return value % 2 === 0 ? value / 2 : -(value + 1) / 2;
}
