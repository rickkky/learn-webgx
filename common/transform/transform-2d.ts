import { mat3 } from 'vectrix';

export function translation(tx: number, ty: number) {
  // prettier-ignore
  const nums = [
    1,  0,  0,
    0,  1,  0,
    tx, ty, 1,
  ];
  return mat3(nums);
}

export function rotation(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  // prettier-ignore
  const nums = [
    c, -s, 0,
    s,  c, 0,
    0,  0, 1,
  ];
  return mat3(nums);
}

export function scaling(sx: number, sy: number) {
  // prettier-ignore
  const nums = [
    sx, 0,  0,
    0,  sy, 0,
    0,  0,  1,
  ];
  return mat3(nums);
}

export function projection(width: number, height: number) {
  const sx = 2 / width;
  // flip y
  const sy = -2 / height;
  const tx = -1;
  const ty = 1;
  // prettier-ignore
  const nums = [
    sx, 0,  0,
    0,  sy, 0,
    tx, ty, 1,
  ]
  return mat3(nums);
}
