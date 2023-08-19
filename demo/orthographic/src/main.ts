import { resizeCanavsToDisplaySize, createProgram } from '/common/helper';
import fragmentShaderSource from './fragment.glsl';
import vertexShaderSource from './vertex.glsl';
import * as data from './data';
import { statehub, state } from './state';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

const vao = gl.createVertexArray();

const positionLocation = gl.getAttribLocation(program, 'a_position');
const positionBuffer = gl.createBuffer();

const colorLocation = gl.getAttribLocation(program, 'a_color');
const colorBuffer = gl.createBuffer();

const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

statehub.settle(render);

function render() {
  resizeCanavsToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  const positions = data.positions;
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  const colors = data.colors;
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

  const matrix = transform(
    orthographic(0, gl.canvas.width, gl.canvas.height, 0, -400, 400),
    translation(state.tx, state.ty, state.tz),
    translation(state.ox, state.oy, state.oz),
    rotationZ(state.rz * (Math.PI / 180)),
    rotationY(state.ry * (Math.PI / 180)),
    rotationX(state.rx * (Math.PI / 180)),
    scaling(state.sx, state.sy, state.sz),
    translation(-state.ox, -state.oy, -state.oz),
  );
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  if (state.enableCullFace) {
    gl.enable(gl.CULL_FACE);
  } else {
    gl.disable(gl.CULL_FACE);
  }
  if (state.enableDepthTest) {
    gl.enable(gl.DEPTH_TEST);
  } else {
    gl.disable(gl.DEPTH_TEST);
  }

  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);
}

function transform(...ms: number[][]) {
  let m = ms[0];
  for (let i = 1; i < ms.length; i++) {
    m = multiply(m, ms[i]);
  }
  return m;
}

function multiply(a: number[], b: number[]) {
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
 *
 * Model coordinate system:
 * - x: left to right;
 * - y: top to bottom;
 * - z: near to far.
 *
 * Clip space range: -1 to 1.
 * Clip space coordinate system:
 * - x: left to right;
 * - y: bottom to top;
 * - z: near to far.
 */
function orthographic(
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

function translation(tx: number, ty: number, tz: number) {
  // prettier-ignore
  return [
    1,  0,  0,  0,
    0,  1,  0,  0,
    0,  0,  1,  0,
    tx, ty, tz, 1,
  ];
}

// Rotate direction: facing negative x axis with counter-clockwise.
function rotationX(rad: number) {
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
function rotationY(rad: number) {
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
function rotationZ(rad: number) {
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

function scaling(sx: number, sy: number, sz: number) {
  // prettier-ignore
  return [
    sx, 0,  0,  0,
    0,  sy, 0,  0,
    0,  0,  sz, 0,
    0,  0,  0,  1,
  ];
}
