export function combine(...ms: number[][]) {
  let m = ms[0];
  for (let i = 1; i < ms.length; i++) {
    m = multiply(m, ms[i]);
  }
  return m;
}

export function multiply(a: number[], b: number[]) {
  const c = [];
  for (let i = 0; i < 3; i++) {
    c[i * 3 + 0] =
      a[0 * 3 + 0] * b[i * 3 + 0] +
      a[1 * 3 + 0] * b[i * 3 + 1] +
      a[2 * 3 + 0] * b[i * 3 + 2];
    c[i * 3 + 1] =
      a[0 * 3 + 1] * b[i * 3 + 0] +
      a[1 * 3 + 1] * b[i * 3 + 1] +
      a[2 * 3 + 1] * b[i * 3 + 2];
    c[i * 3 + 2] =
      a[0 * 3 + 2] * b[i * 3 + 0] +
      a[1 * 3 + 2] * b[i * 3 + 1] +
      a[2 * 3 + 2] * b[i * 3 + 2];
  }
  return c;
}

export function projection(width: number, height: number) {
  const sx = 2 / width;
  // flip y
  const sy = -2 / height;
  const tx = -1;
  const ty = 1;
  // prettier-ignore
  return [
    sx,  0,  0,
    0,   sy, 0,
    tx,  ty, 1,
  ]
}

export function translation(tx: number, ty: number) {
  // prettier-ignore
  return   [
    1,  0,  0,
    0,  1,  0,
    tx, ty, 1,
  ];
}

export function rotation(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  // prettier-ignore
  return[
    c, -s, 0,
    s,  c, 0,
    0,  0, 1,
  ];
}

export function scaling(sx: number, sy: number) {
  // prettier-ignore
  return [
    sx, 0,  0,
    0,  sy, 0,
    0,  0,  1,
  ];
}
