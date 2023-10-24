import { mat4 } from 'glas';

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
 * Convert the view frustum to clip space.
 * Observer is at (0, 0, 0) and facing negative z axis.
 *
 * @param fov - field of view of y-z plane in radian
 * @param aspect - width / height
 * @param near - distance to near plane
 * @param far - distance to far plane
 */
export function perspective(
  fov: number,
  aspect: number,
  near: number,
  far: number,
) {
  /**
   * For a perticular z,
   * the slice of the view frustum in the x-y plane is a rectangle.
   * The range of the sliced rectangle can be calculated by fov and z.
   *
   * y_max = -z * tan(fov / 2)
   * x_max = y_top * aspect
   *
   * Scale the model coordinate to clip space coordinate.
   *
   * y_clip = y / y_max
   * x_clip = x / x_max
   *
   * Define:
   *
   * f = 1 / tan(fov / 2)
   *
   * Then:
   *
   * y_clip = y * f / -z
   * x_clip = x * f / (-z * aspect)
   *
   * Consider the peculiarity of homogeneous coordinates,
   * we assume that the transformed w is -z.
   *
   * So:
   *
   * sy = f
   * sx = f / aspect
   */
  const f = 1 / Math.tan(fov / 2);
  const wz = -1;
  const sy = f;
  const sx = f / aspect;

  /**
   * Use reciprocal function so that
   * z values closer to the observer will get more resolution
   * than those further away.
   *
   * Assume:
   *
   * z_clip = k / z + c
   *        = -k / -z + c * -z / -z
   *        = (-c * z - k) / -z
   *
   * Then:
   *
   * sz = -c
   * tz = -k
   *
   * Consider the near and far plane:
   *
   * k / -near + c = -1
   * k / -far  + c = 1
   *
   * The negative sign is because the observer is facing negative z axis.
   *
   * The solution is:
   *
   * k = 2 * near * far / (far - near)
   * c = (near + far) / (far - near)
   *
   * So:
   *
   * sz = (new + far) / (near - far)
   * tz = 2 * near * far / (near - far)
   */
  const rangeInv = 1 / (near - far);
  const sz = (near + far) * rangeInv;
  const tz = 2 * near * far * rangeInv;

  // prettier-ignore
  const nums = [
    sx, 0,  0,  0,
    0,  sy, 0,  0,
    0,  0,  sz, wz,
    0,  0,  tz, 0,
  ];
  return mat4(nums);
}
