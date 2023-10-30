import { createProgram } from '/common/helper';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';
import data from './data';

export function createRender(gl: WebGL2RenderingContext) {
  const program = createProgram(gl, vertexShader, fragmentShader);

  const vao = gl.createVertexArray();

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const positionBuffer = gl.createBuffer();

  const colorLocation = gl.getAttribLocation(program, 'a_color');
  const colorBuffer = gl.createBuffer();

  const scaleLocation = gl.getAttribLocation(program, 'a_scale');
  const scaleBuffer = gl.createBuffer();

  const offsetLocation = gl.getAttribLocation(program, 'a_offset');
  const offsetBuffer = gl.createBuffer();

  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

  const updateData = () => {
    data.update(gl.canvas.width, gl.canvas.height);
  };

  const render = () => {
    gl.useProgram(program);

    // Calls to `bindBuffer` or `vertexAttribPointer` will be "recorded" in the VAO.
    gl.bindVertexArray(vao);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(data.positions),
      gl.STATIC_DRAW,
    );
    // It implicitly binds the current `ARRAY_BUFFER` to the attribute.
    gl.vertexAttribPointer(
      positionLocation,
      data.positionSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(data.colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      colorLocation,
      data.colorSize,
      gl.UNSIGNED_BYTE,
      true,
      0,
      0,
    );

    gl.enableVertexAttribArray(scaleLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, scaleBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(data.scales),
      gl.STATIC_DRAW,
    );
    gl.vertexAttribPointer(
      scaleLocation,
      data.scaleSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.enableVertexAttribArray(offsetLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(data.offsets),
      gl.STATIC_DRAW,
    );
    gl.vertexAttribPointer(
      offsetLocation,
      data.offsetSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, data.positions.length / data.positionSize);
  };

  render.updateData = updateData;

  return render;
}
