import { observeResize, createProgram, degreeToRadian } from '/common/helper';
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
import { mat4 } from '/common/mat';
import { statehub } from './state';
import type { States } from './state';
import * as data from './data';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;
const render = createRender(gl);

statehub.observe(render);
observeResize({ context: gl, render });

function createRender(gl: WebGL2RenderingContext) {
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

  const render = (states: States = statehub.states) => {
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
    gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    const matrix = mat4.combine(
      mat4.perspective(
        degreeToRadian(states.fov),
        gl.canvas.width / gl.canvas.height,
        1,
        2000,
      ),
      mat4.translation(states.tx, states.ty, states.tz),
      mat4.translation(states.ox, states.oy, states.oz),
      mat4.rotationZ(degreeToRadian(states.rz)),
      mat4.rotationY(degreeToRadian(states.ry)),
      mat4.rotationX(degreeToRadian(states.rx)),
      mat4.scaling(states.sx, states.sy, states.sz),
      mat4.translation(-states.ox, -states.oy, -states.oz),
    );
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    if (states.enableCullFace) {
      gl.enable(gl.CULL_FACE);
    } else {
      gl.disable(gl.CULL_FACE);
    }
    if (states.enableDepthTest) {
      gl.enable(gl.DEPTH_TEST);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
  };

  return render;
}
