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
const oz = ui.setup({
  label: 'Origin Z',
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
const sz = ui.setup({
  label: 'Scale Z',
  type: 'slider',
  props: {
    min: -2,
    max: 2,
  },
  default: 1,
});
const rx = ui.setup({
  label: 'rotate X ',
  type: 'slider',
  props: {
    min: 0,
    max: 360,
  },
  default: 0,
});
const ry = ui.setup({
  label: 'rotate y',
  type: 'slider',
  props: {
    min: 0,
    max: 360,
  },
  default: 0,
});
const rz = ui.setup({
  label: 'rotate Z ',
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
  default: 70,
});
const ty = ui.setup({
  label: 'Translate Y',
  type: 'slider',
  props: {
    min: 0,
    max: 200,
  },
  default: 70,
});
const tz = ui.setup({
  label: 'Translate Z',
  type: 'slider',
  props: {
    min: 0,
    max: 200,
  },
  default: 70,
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
    0,   5,  0,
    0,  -5,  0,
    60, -5,  0,
    60, -5,  0,
    60,  5,  0,
    0,   5,  0,
    60, -10, 0,
    80,  0,  0,
    60,  0,  0,
    60,  0,  0,
    80,  0,  0,
    60,  10, 0,
  ];
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  const matrix = transform(
    projection(gl.canvas.width, gl.canvas.height, 400),
    translation(tx.value, ty.value, tz.value),
    translation(ox.value, oy.value, oz.value),
    rotationZ((rz.value * Math.PI) / 180),
    rotationY((ry.value * Math.PI) / 180),
    rotationX((rx.value * Math.PI) / 180),
    scaling(sx.value, sy.value, sz.value),
    translation(-ox.value, -oy.value, -oz.value),
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

function projection(width: number, height: number, depth: number) {
  // prettier-ignore
  return [
     2 / width,  0,          0,         0,
     0,         -2 / height, 0,         0,
     0,          0,          2 / depth, 0,
    -1,          1,          0,         1,
  ]
}

function translation(tx: number, ty: number, tz: number) {
  // prettier-ignore
  return [
    1,  0,  0,  0,
    0,  1,  0,  0,
    0,  1,  1,  0,
    tx, ty, tz, 1,
  ];
}

function rotationX(rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  // prettier-ignore
  return [
    1, 0,  0, 0,
    0, c, -s, 0,
    0, s,  c, 0,
    0, 0,  0, 1,
  ];
}

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

function rotationZ(rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  // prettier-ignore
  return [
      c, -s, 0, 0,
      s,  c, 0, 0,
      0,  0, 1, 0,
      0,  0, 0, 1,
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
