import { mat3 } from '/common/vectrix';
import { createProgram, degreeToRadian } from '/common/helper';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';
import * as data from './data';
import { statehub, State } from './state';

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

    const matrix = mat3.multiplication([
      mat3.projection(gl.canvas.width, gl.canvas.height),
      mat3.translation(state.tx, state.ty),
      mat3.translation(state.ox, state.oy),
      mat3.rotation(degreeToRadian(state.angle)),
      mat3.scaling(state.sx, state.sy),
      mat3.translation(-state.ox, -state.oy),
    ]);
    gl.uniformMatrix3fv(matrixLocation, false, matrix.toArray());

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
  };

  return render;
}
