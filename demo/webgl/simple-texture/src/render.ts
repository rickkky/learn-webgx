import { createProgram, loadImage } from '/common/helper';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';
import imageSource from '/asset/leaves.jpg';

const image = await loadImage(imageSource);

export function createRender(gl: WebGL2RenderingContext) {
  const program = createProgram(gl, vertexShader, fragmentShader);

  const vao = gl.createVertexArray();

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const positionBuffer = gl.createBuffer();
  // prettier-ignore
  const positions = [
    0,           0,
    image.width, 0,
    0,           image.height,
    0,           image.height,
    image.width, 0,
    image.width, image.height,
  ];
  const positionSize = 2;

  const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
  const texCoordBuffer = gl.createBuffer();
  // prettier-ignore
  const texCoords = [
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,
  ];

  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

  const imageLocation = gl.getUniformLocation(program, 'u_image');

  const texture = gl.createTexture();

  const render = () => {
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

    gl.enableVertexAttribArray(texCoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // Tell the shader to get the texture from texture unit-0.
    gl.uniform1i(imageLocation, 0);

    // Make unit-0 the active texture unit.
    gl.activeTexture(gl.TEXTURE0 + 0);
    // Bind it to texture unit-0's 2D bind point.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
  };

  return render;
}
