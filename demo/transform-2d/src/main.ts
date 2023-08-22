import { resizeCanavsToDisplaySize, createProgram } from '/common/helper';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import { mat3 } from '/common/mat';
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

  const matrix = mat3.combine(
    mat3.projection(gl.canvas.width, gl.canvas.height),
    mat3.translation(state.tx, state.ty),
    mat3.translation(state.ox, state.oy),
    mat3.rotation(state.angle * (Math.PI / 180)),
    mat3.scaling(state.sx, state.sy),
    mat3.translation(-state.ox, -state.oy),
  );
  gl.uniformMatrix3fv(matrixLocation, false, matrix);

  gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
}
