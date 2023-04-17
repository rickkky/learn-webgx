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

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);

const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

const colorLocation = gl.getUniformLocation(program, 'u_color');

for (let i = 0; i < 50; i++) {
  const x0 = Math.random() * gl.canvas.width;
  const y0 = Math.random() * gl.canvas.height;
  const x1 = Math.random() * gl.canvas.width;
  const y1 = Math.random() * gl.canvas.height;
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x0, y0, x0, y1, x1, y0, x0, y1, x1, y1, x1, y0]),
    gl.STATIC_DRAW,
  );
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
