import { mat3 } from 'g-matrix';

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
