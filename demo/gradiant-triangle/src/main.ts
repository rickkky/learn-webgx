import '/common/style.css';
import { resizeCanavsToDisplaySize, createProgram } from '@/common/helper';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;

resizeCanavsToDisplaySize(gl.canvas as HTMLCanvasElement);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// const vao = gl.createVertexArray();
// gl.bindVertexArray(vao);

const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
  -0.6, 0.6, 0.6, 0.6, -0.6, -0.6, -0.6, -0.6, 0.6, 0.6, 0.6, -0.6,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, 'a_color');
gl.enableVertexAttribArray(colorLocation);
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
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
gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
gl.vertexAttribPointer(colorLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, 6);
