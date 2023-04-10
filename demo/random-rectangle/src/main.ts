import '../../../src/style.css';
import { resizeCanavsToDisplaySize, createProgram } from '../../../src/helper';
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

const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getUniformLocation(program, 'u_color');
for (let i = 0; i < 50; i++) {
  const x0 = (Math.random() * gl.canvas.width) / 2;
  const y0 = (Math.random() * gl.canvas.height) / 2;
  const width = (Math.random() * gl.canvas.width) / 2;
  const height = (Math.random() * gl.canvas.height) / 2;
  const x1 = x0 + width;
  const y1 = y0 + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x0, y0, x0, y1, x1, y0, x0, y1, x1, y1, x1, y0]),
    gl.STATIC_DRAW,
  );
  gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
