import { observeResize, createProgram } from '/common/helper';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;
const render = createRender(gl);

observeResize({ context: gl, render });

function createRender(gl: WebGL2RenderingContext) {
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  return () => {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vao = gl.createVertexArray();
    // Calls to `bindBuffer` or `vertexAttribPointer` will be "recorded" in the VAO.
    gl.bindVertexArray(vao);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    // prettier-ignore
    const positions = [
      0, 0,
      0, 0.5,
      1, 0,
    ];
    const positionSize = 2;
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

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
  };
}
