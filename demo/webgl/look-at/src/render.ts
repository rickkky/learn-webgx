import { mat4, vec3 } from 'vectrix';
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

    const matrix = mat4.multiplication([
      mat4.perspective(
        degreeToRadian(state.fov),
        gl.canvas.width / gl.canvas.height,
        1,
        2000,
      ),
      mat4.lookAt(
        vec3(state.cx, state.cy, state.cz),
        vec3(0, 0, 0),
        vec3(0, 1, 0),
      ),
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
