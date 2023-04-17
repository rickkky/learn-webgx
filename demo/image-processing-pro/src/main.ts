import { resizeCanavsToDisplaySize, createProgram } from '@/common/helper';
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
const positions = [
  0,
  0,
  0,
  image.height,
  image.width,
  0,
  image.width,
  0,
  0,
  image.height,
  image.width,
  image.height,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
gl.enableVertexAttribArray(texCoordLocation);
const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
const texCoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

const imageLocation = gl.getUniformLocation(program, 'u_image');
gl.uniform1i(imageLocation, 0);

const originalTexture = createAndSetupTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, originalTexture);
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

  const attachmentPoint = gl.COLOR_ATTACHMENT0;
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    attachmentPoint,
    gl.TEXTURE_2D,
    texture,
    0,
  );
}

const kernels: Record<string, number[]> = {
  normal: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  gaussianBlur: [0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045],
  unsharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
  emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
};

const kernelLocation = gl.getUniformLocation(program, 'u_kernel[0]');
const kernelWeightLocation = gl.getUniformLocation(program, 'u_kernelWeight');

drawEffects();

function loadImage(imageSource: string) {
  const image = new Image();
  image.src = imageSource;
  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject();
  });
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

function drawEffects() {
  const effects: string[] = [];
  let count = 0;
  for (let i = 0; i < effects.length; i++) {
    setFrameBuffer(framebuffers[count % 2], image.width, image.height);
    drawWithKernel(effects[i]);
    gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);
    count += 1;
  }
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
