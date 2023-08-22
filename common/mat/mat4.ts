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

export function combine(...ms: number[][]) {
  let m = ms[0];
  for (let i = 1; i < ms.length; i++) {
    m = multiply(m, ms[i]);
  }
  return m;
}

export function multiply(a: number[], b: number[]) {
  const c = [];
  for (let i = 0; i < 4; i++) {
    c[i * 4 + 0] =
      a[0 * 4 + 0] * b[i * 4 + 0] +
      a[1 * 4 + 0] * b[i * 4 + 1] +
      a[2 * 4 + 0] * b[i * 4 + 2] +
      a[3 * 4 + 0] * b[i * 4 + 3];
    c[i * 4 + 1] =
      a[0 * 4 + 1] * b[i * 4 + 0] +
      a[1 * 4 + 1] * b[i * 4 + 1] +
      a[2 * 4 + 1] * b[i * 4 + 2] +
      a[3 * 4 + 1] * b[i * 4 + 3];
    c[i * 4 + 2] =
      a[0 * 4 + 2] * b[i * 4 + 0] +
      a[1 * 4 + 2] * b[i * 4 + 1] +
      a[2 * 4 + 2] * b[i * 4 + 2] +
      a[3 * 4 + 2] * b[i * 4 + 3];
    c[i * 4 + 3] =
      a[0 * 4 + 3] * b[i * 4 + 0] +
      a[1 * 4 + 3] * b[i * 4 + 1] +
      a[2 * 4 + 3] * b[i * 4 + 2] +
      a[3 * 4 + 3] * b[i * 4 + 3];
  }
  return c;
}

/**
 * Transformation to convert model coordinate to clip space coordinate.
 */
export function orthographic(
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number,
) {
  const width = right - left;
  const height = bottom - top;
  const depth = far - near;
  const sx = 2 / width;
  const sy = -2 / height;
  const sz = 2 / depth;
  const tx = -(right + left) / width;
  const ty = (top + bottom) / height;
  const tz = -(near + far) / depth;
  // prettier-ignore
  return [
    sx,  0,  0,  0,
    0,   sy, 0,  0,
    0,   0,  sz, 0,
    tx,  ty, tz, 1,
  ]
}

/**
 * Convert the view frustum to clip space.
 * Observer is at (0, 0, 0) and facing negative z axis.
 *
 * Model coordinate system:
 * - x: left to right;
 * - y: bottom to top;
 * - z: near to far.
 *
 * Clip space range: -1 to 1.
 * Clip space coordinate system:
 * - x: left to right;
 * - y: bottom to top;
 * - z: near to far.
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
   * For x and y:
   *
   * Define: f = 1 / tan(fov / 2)
   *
   * edgeY = -modelZ * tan(fov / 2)
   *       = -modelZ / f
   * edgeX = edgeY * aspect
   *
   * clipY = modelY / edgeY
   *       = modelY * f / -modelZ
   * clipX = modelX / edgeX
   *       = modelX * f / (-modelZ * aspect)
   *
   * The transformed w will be -modelZ.
   * So:
   * sx = f / aspect
   * sy = f
   */
  const f = 1 / Math.tan(fov / 2);
  const sx = f / aspect;
  const sy = f;
  const wz = -1;
  /**
   * For z:
   *
   * Use reciprocal function so that
   * z values close the camera get more resolution
   * than z values far from the camera.
   *
   * Assume: clipZ = s / modelZ + c
   *               = -s / -modelZ + c * -modelZ / -modelZ
   *               = (-c * modelZ - s) / modelZ
   *
   * Consider the near and far plane:
   * s / -near + c = -1
   * s / -far  + c = 1
   *
   * The solution is:
   * s = 2 * near * far / (far - near)
   * c = (near + far) / (far - near)
   *
   * So:
   * sz = -c
   * tz = -s
   */
  const rangeInv = 1 / (near - far);
  const sz = (near + far) * rangeInv;
  const tz = 2 * near * far * rangeInv;
  // prettier-ignore
  return [
    sx, 0,  0,  0,
    0,  sy, 0,  0,
    0,  0,  sz, wz,
    0,  0,  tz, 0,
  ]
}

export function translation(tx: number, ty: number, tz: number) {
  // prettier-ignore
  return [
    1,  0,  0,  0,
    0,  1,  0,  0,
    0,  0,  1,  0,
    tx, ty, tz, 1,
  ];
}

// Rotate direction: facing negative x axis with counter-clockwise.
export function rotationX(rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  // prettier-ignore
  return [
    1,  0, 0, 0,
    0,  c, s, 0,
    0, -s, c, 0,
    0,  0, 0, 1,
  ];
}

// Rotate direction: facing negative y axis with counter-clockwise.
export function rotationY(rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  // prettier-ignore
  return [
    c, 0, -s, 0,
    0, 1,  0, 0,
    s, 0,  c, 0,
    0, 0,  0, 1,
  ];
}

// Rotate direction: facing negative z axis with counter-clockwise.
export function rotationZ(rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  // prettier-ignore
  return [
     c, s, 0, 0,
    -s, c, 0, 0,
     0, 0, 1, 0,
     0, 0, 0, 1,
  ];
}

export function scaling(sx: number, sy: number, sz: number) {
  // prettier-ignore
  return [
    sx, 0,  0,  0,
    0,  sy, 0,  0,
    0,  0,  sz, 0,
    0,  0,  0,  1,
  ];
}
