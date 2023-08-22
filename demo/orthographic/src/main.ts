import { resizeCanavsToDisplaySize, createProgram } from '/common/helper';
import fragmentShaderSource from './fragment.glsl';
import vertexShaderSource from './vertex.glsl';
import { mat4 } from '/common/mat';
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

const colorLocation = gl.getAttribLocation(program, 'a_color');
const colorBuffer = gl.createBuffer();
const colors = data.colors;

const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

statehub.settle(render);

function render() {
  resizeCanavsToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, positionSize, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

  const matrix = mat4.combine(
    mat4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -400, 400),
    mat4.translation(state.tx, state.ty, state.tz),
    mat4.translation(state.ox, state.oy, state.oz),
    mat4.rotationZ(state.rz * (Math.PI / 180)),
    mat4.rotationY(state.ry * (Math.PI / 180)),
    mat4.rotationX(state.rx * (Math.PI / 180)),
    mat4.scaling(state.sx, state.sy, state.sz),
    mat4.translation(-state.ox, -state.oy, -state.oz),
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

  gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
}
