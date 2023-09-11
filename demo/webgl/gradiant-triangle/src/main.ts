import { resizeCanavsToDisplaySize, createProgram } from '/common/helper';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;

resizeCanavsToDisplaySize(canvas);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const positionLocation = gl.getAttribLocation(program, 'a_position');
const positionBuffer = gl.createBuffer();
// prettier-ignore
const positions = [
  -0.6,  0.6,
   0.6,  0.6,
  -0.6, -0.6,
  -0.6, -0.6,
   0.6,  0.6,
   0.6, -0.6,
];
const positionSize = 2;
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.vertexAttribPointer(positionLocation, positionSize, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, 'a_color');
const colorBuffer = gl.createBuffer();
const randomColor = () => [
  Math.random() * 256,
  Math.random() * 256,
  Math.random() * 256,
  255,
];
const colors = [
  ...randomColor(),
  ...randomColor(),
  ...randomColor(),
  ...randomColor(),
  ...randomColor(),
  ...randomColor(),
];
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
gl.vertexAttribPointer(colorLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
