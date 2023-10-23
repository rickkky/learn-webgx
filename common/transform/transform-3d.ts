import { mat4 } from 'g-matrix';

/**
 * We assume that the model coordinate system is right-handed, with
 * x axis pointing to the right,
 * y axis pointing to the top,
 * z axis pointing away from the screen.
 */

export function translation(tx: number, ty: number, tz: number) {
  // prettier-ignore
  const nums = [
    1,  0,  0,  0,
    0,  1,  0,  0,
    0,  0,  1,  0,
    tx, ty, tz, 1,
  ];
  return mat4(nums);
}

/**
 * Rotate direction: facing negative x axis with counter-clockwise.
 */
export function rotationX(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  // prettier-ignore
  const nums = [
    1,  0, 0, 0,
    0,  c, s, 0,
    0, -s, c, 0,
    0,  0, 0, 1,
  ];
  return mat4(nums);
}

/**
 * Rotate direction: facing negative y axis with counter-clockwise.
 */
export function rotationY(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  // prettier-ignore
  const nums = [
    c, 0, -s, 0,
    0, 1,  0, 0,
    s, 0,  c, 0,
    0, 0,  0, 1,
  ];
  return mat4(nums);
}

/**
 * Rotate direction: facing negative z axis with counter-clockwise.
 */
export function rotationZ(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  // prettier-ignore
  const nums = [
     c, s, 0, 0,
    -s, c, 0, 0,
     0, 0, 1, 0,
     0, 0, 0, 1,
  ];
  return mat4(nums);
}

export function rotation(angleX: number, angleY: number, angleZ: number) {
  return mat4.multiplication(
    rotationZ(angleZ),
    rotationY(angleY),
    rotationX(angleX),
  );
}

export function scaling(sx: number, sy: number, sz: number) {
  // prettier-ignore
  const nums = [
    sx, 0,  0,  0,
    0,  sy, 0,  0,
    0,  0,  sz, 0,
    0,  0,  0,  1,
  ];
  return mat4(nums);
}
