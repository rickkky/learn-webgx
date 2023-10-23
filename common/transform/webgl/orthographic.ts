import { mat4 } from 'g-matrix';

/**
 * We assume that the model coordinate system is right-handed, with
 * x axis pointing to the right,
 * y axis pointing to the top,
 * z axis pointing away from the screen.
 *
 * Clip space coordinate system is left-handed, with
 * x axis pointing to the right,
 * y axis pointing to the top,
 * z axis pointing towards the screen.
 * Clip space range: -1 to 1.
 */

/**
 * Transformation to convert model coordinate to clip space coordinate.
 */
export function orthographic(
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  zMin: number,
  zMax: number,
) {
  const width = xMax - xMin;
  const height = yMax - yMin;
  const depth = zMax - zMin;
  const sx = 2 / width;
  const sy = 2 / height;
  // flip z
  const sz = -(2 / depth);
  const tx = -(xMax + xMin) / width;
  const ty = -(yMax + yMin) / height;
  const tz = -(zMax + zMin) / depth;
  // prettier-ignore
  const nums = [
    sx, 0,  0,  0,
    0,  sy, 0,  0,
    0,  0,  sz, 0,
    tx, ty, tz, 1,
  ];
  return mat4(nums);
}
