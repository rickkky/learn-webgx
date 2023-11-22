import { mat4, vec3, Vector3 } from 'vectrix';

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

export interface BoundingBox {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
}

export const CLIPSPACE = {
  WEBGL: {
    xMin: -1,
    xMax: 1,
    yMin: -1,
    yMax: 1,
    zMin: -1,
    zMax: 1,
  } as BoundingBox,
  WEBGPU: {
    xMin: -1,
    xMax: 1,
    yMin: -1,
    yMax: 1,
    zMin: 0,
    zMax: 1,
  } as BoundingBox,
};

/**
 * Transform the view bounding box to clip space bounding box.
 */
export function orthographic(
  view: BoundingBox,
  clip: BoundingBox = CLIPSPACE.WEBGL,
) {
  const width = view.xMax - view.xMin;
  const height = view.yMax - view.yMin;
  const depth = view.zMax - view.zMin;
  const sx = (clip.xMax - clip.xMin) / width;
  const sy = (clip.yMax - clip.yMin) / height;
  const sz = -(clip.zMax - clip.zMin) / depth;
  const tx = (clip.xMin * view.xMax - clip.xMax * view.xMin) / width;
  const ty = (clip.yMin * view.yMax - clip.yMax * view.yMin) / height;
  const tz = (clip.zMin * view.zMax - clip.zMax * view.zMin) / depth;
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
 * @param {number} fov - field of view of y-z plane in radian
 * @param {number} aspect - width / height
 * @param {number} near - distance to near plane
 * @param {number} far - distance to far plane
 * @param {BoundingBox} clip - clip space bounding box
 */
export function perspective(
  fov: number,
  aspect: number,
  near: number,
  far: number,
  clip: BoundingBox = CLIPSPACE.WEBGL,
) {
  /**
   * For a perticular z,
   * the slice of the view frustum in the x-y plane is a rectangle.
   * The range of the sliced rectangle can be calculated by fov and z.
   *
   * y_max = -z * tan(fov / 2)
   * x_max = y_max * aspect
   *
   * Scale the model coordinate to clip space coordinate.
   *
   * y_clip = ((y_clip_max - y_clip_min) / (2 * y_max)) * y + (y_clip_max + y_clip_min) / 2
   * x_clip = ((x_clip_max - x_clip_min) / (2 * x_max)) * x + (x_clip_max + x_clip_min) / 2
   *
   * Define:
   *
   * f = 1 / tan(fov / 2)
   *
   * Then:
   *
   * y_clip = (y_clip_max - y_clip_min) * f / (2 * -z) * y + (y_clip_max + y_clip_min) / 2
   * x_clip = (x_clip_max - x_clip_min) * f / (2 * -z * aspect) * x + (x_clip_max + x_clip_min) / 2
   *
   * Consider the peculiarity of homogeneous coordinates,
   * we assume that the transformed w is -z.
   *
   * So:
   *
   * sy = (y_clip_max - y_clip_min) * f / 2
   * ty = (y_clip_max + y_clip_min) / 2
   * sx = (x_clip_max - x_clip_min) * f / (2 * aspect)
   * tx = (x_clip_max + x_clip_min) / 2
   */
  const f = 1 / Math.tan(fov / 2);
  const wz = -1;
  const sy = ((clip.yMax - clip.yMin) * f) / 2;
  const ty = (clip.yMax + clip.yMin) / 2;
  const sx = ((clip.xMax - clip.xMin) * f) / (2 * aspect);
  const tx = (clip.xMax + clip.xMin) / 2;

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
   * k / -near + c = z_clip_min
   * k / -far  + c = z_clip_max
   *
   * The negative sign is because the observer is facing negative z axis.
   *
   * The solution is:
   *
   * k = (z_clip_max - z_clip_min) * near * far / (far - near)
   * c = (z_clip_max * far - z_clip_min * near) / (far - near)
   *
   * So:
   *
   * sz = (z_clip_max * far - z_clip_min * near) / (near - far)
   * tz = (z_clip_max - z_clip_min) * near * far / (near - far)
   */
  const rangeInverse = 1 / (near - far);
  const sz = (clip.zMax * far - clip.zMin * near) * rangeInverse;
  const tz = (clip.zMax - clip.zMin) * near * far * rangeInverse;

  // prettier-ignore
  const nums = [
    sx, 0,  0,  0,
    0,  sy, 0,  0,
    0,  0,  sz, wz,
    tx, ty, tz, 0,
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
  const zUnit = vec3.subtract(eye, target).normalize();
  const xUnit = vec3.cross(up, zUnit).normalize();
  const yUnit = vec3.cross(zUnit, xUnit).normalize();
  // prettier-ignore
  const nums = [
    xUnit.x,  xUnit.y,  xUnit.z, 0,
    yUnit.x,  yUnit.y,  yUnit.z, 0,
    zUnit.x,  zUnit.y,  zUnit.z, 0,
    eye.x,    eye.y,    eye.z,   1,
  ];
  return mat4(nums);
}

export function lookAt(eye: Vector3, target: Vector3, up: Vector3) {
  return mat4.invert(targetTo(eye, target, up));
}
