// varint.js：折返与变长编码
export function zigzag(value) {
  return value < 0 ? -value * 2 - 1 : value * 2;
}

function unzigzag(code) {
  return (code & 1) === 0 ? code / 2 : -(code + 1) / 2;
}

export function encodeVarint(value) {
  let rest = zigzag(value);
  const bytes = [];
  while (rest >= 0x80) {
    bytes.push((rest & 0x7f) | 0x80);
    rest = Math.floor(rest / 128);
  }
  bytes.push(rest & 0x7f);
  return bytes;
}

export function decodeVarint(bytes) {
  let code = 0;
  let scale = 1;
  for (const byte of bytes) {
    code += (byte & 0x7f) * scale;
    scale *= 128;
  }
  return unzigzag(code);
}
