import { resizeCanavsToDisplaySize, createProgram } from '/common/helper';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import * as data from './data';
import { statehub, state } from './state';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

const vao = gl.createVertexArray();

const positionLocation = gl.getAttribLocation(program, 'a_position');
const positionBuffer = gl.createBuffer();
const positions = data.positions;
const positionSize = data.positionSize;

const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

statehub.settle(render);

function render() {
  resizeCanavsToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, positionSize, gl.FLOAT, false, 0, 0);

  const matrix = transform(
    projection(gl.canvas.width, gl.canvas.height),
    translation(state.tx, state.ty),
    translation(state.ox, state.oy),
    rotation(state.angle * (Math.PI / 180)),
    scaling(state.sx, state.sy),
    translation(-state.ox, -state.oy),
  );
  gl.uniformMatrix3fv(matrixLocation, false, matrix);

  gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
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
  for (let i = 0; i < 3; i++) {
    c[i * 3 + 0] =
      a[0 * 3 + 0] * b[i * 3 + 0] +
      a[1 * 3 + 0] * b[i * 3 + 1] +
      a[2 * 3 + 0] * b[i * 3 + 2];
    c[i * 3 + 1] =
      a[0 * 3 + 1] * b[i * 3 + 0] +
      a[1 * 3 + 1] * b[i * 3 + 1] +
      a[2 * 3 + 1] * b[i * 3 + 2];
    c[i * 3 + 2] =
      a[0 * 3 + 2] * b[i * 3 + 0] +
      a[1 * 3 + 2] * b[i * 3 + 1] +
      a[2 * 3 + 2] * b[i * 3 + 2];
  }
  return c;
}

function projection(width: number, height: number) {
  const sx = 2 / width;
  // flip y
  const sy = -2 / height;
  const tx = -1;
  const ty = 1;
  // prettier-ignore
  return [
    sx,  0,  0,
    0,   sy, 0,
    tx,  ty, 1,
  ]
}

function translation(tx: number, ty: number) {
  // prettier-ignore
  return   [
    1,  0,  0,
    0,  1,  0,
    tx, ty, 1,
  ];
}

function rotation(rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  // prettier-ignore
  return[
    c, -s, 0,
    s,  c, 0,
    0,  0, 1,
  ];
}

function scaling(sx: number, sy: number) {
  // prettier-ignore
  return [
    sx, 0,  0,
    0,  sy, 0,
    0,  0,  1,
  ];
}
