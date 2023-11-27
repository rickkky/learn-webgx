import { mat4 } from 'vectrix';
import { createProgram, degreeToRadian } from '/common/helper';
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
import data from './data';
import { statehub, State } from './state';

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
  const colorSize = data.colorSize;

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
    gl.vertexAttribPointer(
      colorLocation,
      colorSize,
      gl.UNSIGNED_BYTE,
      true,
      0,
      0,
    );

    const matrix = mat4.multiplication([
      mat4.orthographic({
        xMin: -gl.canvas.width / 2,
        xMax: gl.canvas.width / 2,
        yMin: -gl.canvas.height / 2,
        yMax: gl.canvas.height / 2,
        zMin: -400,
        zMax: 400,
      }),
      mat4.translation(state.tx, state.ty, state.tz),
      mat4.translation(state.ox, state.oy, state.oz),
      mat4.rotation(
        degreeToRadian(state.rx),
        degreeToRadian(state.ry),
        degreeToRadian(state.rz),
      ),
      mat4.scaling(state.sx, state.sy, state.sz),
      mat4.translation(-state.ox, -state.oy, -state.oz),
    ]);
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
