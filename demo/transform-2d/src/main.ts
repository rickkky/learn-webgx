import { observeResize, createProgram } from '/common/helper';
import { mat3 } from '/common/mat';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';
import * as data from './data';
import { States, statehub } from './state';

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

  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

  const render = (states: States = statehub.states) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindVertexArray(vao);

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

    const matrix = mat3.combine(
      mat3.projection(gl.canvas.width, gl.canvas.height),
      mat3.translation(states.tx, states.ty),
      mat3.translation(states.ox, states.oy),
      mat3.rotation(states.angle * (Math.PI / 180)),
      mat3.scaling(states.sx, states.sy),
      mat3.translation(-states.ox, -states.oy),
    );
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
  };

  return render;
}
