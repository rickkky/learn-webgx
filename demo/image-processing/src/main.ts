import { resizeCanavsToDisplaySize, createProgram } from '/common/helper';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import imageSource from './leaves.jpg';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;

resizeCanavsToDisplaySize(gl.canvas as HTMLCanvasElement);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const image = await loadImage(imageSource);

const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// prettier-ignore
const positions = [
  0,           0,
  image.width, 0,
  0,           image.height,
  0,           image.height,
  image.width, 0,
  image.width, image.height,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
gl.enableVertexAttribArray(texCoordLocation);
const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
// prettier-ignore
const texCoords = [
  0, 0,
  1, 0,
  0, 1,
  0, 1,
  1, 0,
  1, 1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

const imageLocation = gl.getUniformLocation(program, 'u_image');
gl.uniform1i(imageLocation, 0);

const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0 + 0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

const kernelLocation = gl.getUniformLocation(program, 'u_kernel[0]');
// prettier-ignore
const edgeDetectKernel = [
  -1, -1, -1,
  -1,  8, -1,
  -1, -1, -1
];
gl.uniform1fv(kernelLocation, edgeDetectKernel);

const kernelWeightLocation = gl.getUniformLocation(program, 'u_kernelWeight');
gl.uniform1f(kernelWeightLocation, computeKernelWeight(edgeDetectKernel));

gl.drawArrays(gl.TRIANGLES, 0, 6);

function loadImage(imageSource: string) {
  const image = new Image();
  image.src = imageSource;
  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject();
  });
}

function computeKernelWeight(kernel: number[]) {
  const weight = kernel.reduce((sum, value) => sum + value, 0);
  return weight <= 0 ? 1 : weight;
}
