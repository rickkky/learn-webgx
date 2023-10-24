import { mat3 } from 'glas';

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
