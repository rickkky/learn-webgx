import { resizeCanavsToDisplaySize, createProgram } from '/common/helper';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import { createUi } from '/common/ui';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;

const ui = await createUi();

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

const vao = gl.createVertexArray();

const positionLocation = gl.getAttribLocation(program, 'a_position');
const positionBuffer = gl.createBuffer();

const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

const ox = ui.setup({
  label: 'Origin X',
  type: 'slider',
  props: {
    min: 0,
    max: 70,
  },
  default: 0,
});
const oy = ui.setup({
  label: 'Origin Y',
  type: 'slider',
  props: {
    min: -10,
    max: 10,
  },
  default: 0,
});
const sx = ui.setup({
  label: 'Scale X',
  type: 'slider',
  props: {
    min: -2,
    max: 2,
  },
  default: 1,
});
const sy = ui.setup({
  label: 'Scale Y',
  type: 'slider',
  props: {
    min: -2,
    max: 2,
  },
  default: 1,
});
const angle = ui.setup({
  label: 'Angle',
  type: 'slider',
  props: {
    min: 0,
    max: 360,
  },
  default: 0,
});
const tx = ui.setup({
  label: 'Translate X',
  type: 'slider',
  props: {
    min: 0,
    max: 200,
  },
  default: 80,
});
const ty = ui.setup({
  label: 'Translate Y',
  type: 'slider',
  props: {
    min: 0,
    max: 200,
  },
  default: 80,
});

ui.settle(render);

function render() {
  resizeCanavsToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  // prettier-ignore
  const positions = [
    0,   5,
    0,  -5,
    60, -5,
    60, -5,
    60,  5,
    0,   5,
    60, -10,
    80,  0,
    60,  0,
    60,  0,
    80,  0,
    60,  10,
  ];
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const matrix = transform(
    projection(gl.canvas.width, gl.canvas.height),
    translation(tx.value, ty.value),
    translation(ox.value, oy.value),
    rotation((angle.value * Math.PI) / 180),
    scaling(sx.value, sy.value),
    translation(-ox.value, -oy.value),
  );
  gl.uniformMatrix3fv(matrixLocation, false, matrix);

  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
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
  // prettier-ignore
  return [
     2 / width,  0,          0,
     0,         -2 / height, 0,
    -1,          1,          1,
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
