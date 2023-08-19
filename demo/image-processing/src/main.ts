import {
  resizeCanavsToDisplaySize,
  createProgram,
  loadImage,
} from '/common/helper';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import { statehub, state, kernels } from './state';
import imageSource from './leaves.jpg';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;

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

const flipYLocation = gl.getUniformLocation(program, 'u_flipY');

const imageLocation = gl.getUniformLocation(program, 'u_image');
gl.uniform1i(imageLocation, 0);

const originalTexture = createAndSetupTexture();
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

const textures: WebGLTexture[] = [];
const framebuffers: WebGLFramebuffer[] = [];
for (let i = 0; i < 2; i++) {
  const texture = createAndSetupTexture()!;
  textures.push(texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    image.width,
    image.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );

  const fbo = gl.createFramebuffer()!;
  framebuffers.push(fbo);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );
}

const kernelLocation = gl.getUniformLocation(program, 'u_kernel[0]');
const kernelWeightLocation = gl.getUniformLocation(program, 'u_kernelWeight');

statehub.settle(render);

function render() {
  resizeCanavsToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawEffects(state.effects);
}

function createAndSetupTexture() {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return texture;
}

function drawEffects(effects: string[]) {
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, originalTexture);
  gl.uniform1f(flipYLocation, 1);
  let count = 0;
  for (let i = 0; i < effects.length; i++) {
    setFrameBuffer(framebuffers[count % 2], image.width, image.height);
    drawWithKernel(effects[i]);
    gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);
    count += 1;
  }
  gl.uniform1f(flipYLocation, -1);
  setFrameBuffer(null, gl.canvas.width, gl.canvas.height);
  drawWithKernel('normal');
}

function setFrameBuffer(
  fbo: WebGLFramebuffer | null,
  width: number,
  height: number,
) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.uniform2f(resolutionLocation, width, height);
  gl.viewport(0, 0, width, height);
}

function drawWithKernel(name: string) {
  const kernel = kernels[name];
  gl.uniform1fv(kernelLocation, kernel);
  gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernel));
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function computeKernelWeight(kernel: number[]) {
  const weight = kernel.reduce((sum, value) => sum + value, 0);
  return weight <= 0 ? 1 : weight;
}
