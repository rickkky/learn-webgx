import { createProgram, randomColor } from '/common/helper';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

export function createRender(gl: WebGL2RenderingContext) {
  const program = createProgram(gl, vertexShader, fragmentShader);

  const vao = gl.createVertexArray();

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const positionBuffer = gl.createBuffer();
  const positionSize = 2;

  const colorLocation = gl.getAttribLocation(program, 'a_color');
  const colorBuffer = gl.createBuffer();
  const colors = [...randomColor(), ...randomColor(), ...randomColor()];

  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

  const render = () => {
    gl.useProgram(program);

    // Calls to `bindBuffer` or `vertexAttribPointer` will be "recorded" in the VAO.
    gl.bindVertexArray(vao);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // prettier-ignore
    const positions = [
      0.5 * gl.canvas.width, 0.2 * gl.canvas.height,
      0.2 * gl.canvas.width, 0.8 * gl.canvas.height,
      0.8 * gl.canvas.width, 0.8 * gl.canvas.height,
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

    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
  };

  return render;
}
