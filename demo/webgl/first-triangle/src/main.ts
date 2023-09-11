import { observeResize, createProgram } from '/common/helper';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;
const render = createRender(gl);

observeResize({ context: gl, render });

function createRender(gl: WebGL2RenderingContext) {
  const program = createProgram(gl, vertexShader, fragmentShader);

  const vao = gl.createVertexArray();

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const positionBuffer = gl.createBuffer();
  const positionSize = 2;

  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

  return () => {
    gl.useProgram(program);

    // Calls to `bindBuffer` or `vertexAttribPointer` will be "recorded" in the VAO.
    gl.bindVertexArray(vao);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // prettier-ignore
    const positions = [
      0.5  * gl.canvas.width, 0.25 * gl.canvas.height,
      0.25 * gl.canvas.width, 0.75 * gl.canvas.height,
      0.75 * gl.canvas.width, 0.75 * gl.canvas.height,
    ];
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // It implicitly binds the current `ARRAY_BUFFER` to the attribute.
    gl.vertexAttribPointer(
      positionLocation,
      positionSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
  };
}
