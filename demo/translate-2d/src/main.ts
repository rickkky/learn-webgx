import { resizeCanavsToDisplaySize, createProgram } from '/common/helper';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import { createStatehub } from '/common/statehub';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;

const statehub = await createStatehub();

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

const vao = gl.createVertexArray();

const positionLocation = gl.getAttribLocation(program, 'a_position');
const positionBuffer = gl.createBuffer();

const translationLocation = gl.getUniformLocation(program, 'u_translation');

const translateX = statehub.setup({
  label: 'Translate X',
  type: 'slider',
  props: {
    min: -1,
    max: 1,
  },
  default: 0,
});
const translateY = statehub.setup({
  label: 'Translate Y',
  type: 'slider',
  props: {
    min: -1,
    max: 1,
  },
  default: 0,
});

statehub.settle(render);

function render() {
  resizeCanavsToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  // prettier-ignore
  const positions = [
    -0.1,  0.1,
     0.1,  0.1,
    -0.1, -0.1,
    -0.1, -0.1,
     0.1,  0.1,
     0.1, -0.1,
  ];
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2fv(translationLocation, [translateX.value, translateY.value]);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
