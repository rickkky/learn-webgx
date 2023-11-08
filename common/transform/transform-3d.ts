import { mat4, vec3, Vector3 } from 'glas';

/**
 * Model coordinate system is right-handed, with
 * x axis pointing to the right,
 * y axis pointing to the top,
 * z axis pointing away from the screen.
 *
 * Clip space coordinate system is left-handed, with
 * x axis pointing to the right,
 * y axis pointing to the top,
 * z axis pointing towards the screen.
 *
 * Clip space range of x and y: [-1, 1].
 *
 * Clip space range of z:
 * for WebGL/OpenGL: [-1, 1];
 * for WebGPU/Vulkan/DirectX/Metal: [0, 1].
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

/**
 * Transformation to convert model coordinate to clip space coordinate.
 */
export function orthographic({
  xMin,
  xMax,
  yMin,
  yMax,
  zMin,
  zMax,
}: {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
}) {
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

/**
 * Transformation that makes something look at something else.
 */
export function targetTo(eye: Vector3, target: Vector3, up: Vector3) {
  if (eye.equals(target)) {
    return mat4.identity();
  }
  const uz = vec3.subtract(eye, target).normalize();
  const ux = vec3.cross(up, uz).normalize();
  const uy = vec3.cross(uz, ux).normalize();
  // prettier-ignore
  const nums = [
    ux.x,  ux.y,  ux.z, 0,
    uy.x,  uy.y,  uy.z, 0,
    uz.x,  uz.y,  uz.z, 0,
    eye.x, eye.y, eye.z, 1,
  ];
  return mat4(nums);
}
