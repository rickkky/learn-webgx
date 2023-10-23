import { mat4 } from 'g-matrix';
import { createProgram, degreeToRadian } from '/common/helper';
import { orthographic } from '/common/transform/webgl/orthographic';
import { translation, rotation, scaling } from '/common/transform/transform-3d';
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
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

  const colorLocation = gl.getAttribLocation(program, 'a_color');
  const colorBuffer = gl.createBuffer();
  const colors = data.colors;

  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

  const render = (state: State = statehub.state) => {
    gl.useProgram(program);

    gl.bindVertexArray(vao);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

    const matrix = mat4.multiplication(
      orthographic(0, gl.canvas.width, 0, gl.canvas.height, -400, 400),
      translation(state.tx, state.ty, state.tz),
      translation(state.ox, state.oy, state.oz),
      rotation(
        degreeToRadian(state.rx),
        degreeToRadian(state.ry),
        degreeToRadian(state.rz),
      ),
      scaling(state.sx, state.sy, state.sz),
      translation(-state.ox, -state.oy, -state.oz),
    );
    gl.uniformMatrix4fv(matrixLocation, false, matrix.toArray());

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
  };

  return render;
}