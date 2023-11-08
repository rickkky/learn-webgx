import { mat3 } from 'glas';
import { createProgram, degreeToRadian } from '/common/helper';
import {
  translation,
  rotation,
  scaling,
  projection,
} from '/common/transform/transform-2d';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';
import { statehub } from './state';
import type { State } from './state';
import * as data from './data';

export function createRender(gl: WebGL2RenderingContext) {
  const program = createProgram(gl, vertexShader, fragmentShader);

  const vao = gl.createVertexArray();

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const positionBuffer = gl.createBuffer();
  const positions = data.positions;
  const positionSize = data.positionSize;

  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

  const render = (state: State = statehub.state) => {
    gl.useProgram(program);

    gl.bindVertexArray(vao);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      positionLocation,
      positionSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    const matrix = mat3.multiplication(
      projection(gl.canvas.width, gl.canvas.height),
      translation(state.tx, state.ty),
      translation(state.ox, state.oy),
      rotation(degreeToRadian(state.angle)),
      scaling(state.sx, state.sy),
      translation(-state.ox, -state.oy),
    );
    gl.uniformMatrix3fv(matrixLocation, false, matrix.toArray());

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
  };

  return render;
}
