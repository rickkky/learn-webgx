import { resizeCanavsToDisplaySize, createProgram } from '/common/helper';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import { createUi } from '/common/ui';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;

const ui = await createUi();

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

const vao = gl.createVertexArray();

const positionLocation = gl.getAttribLocation(program, 'a_position');
const positionBuffer = gl.createBuffer();

const rotationLocation = gl.getUniformLocation(program, 'u_rotation');

const angle = ui.setup({
  label: 'Angle',
  type: 'slider',
  props: {
    min: 0,
    max: 360,
  },
  default: 0,
});

ui.settle(render);

function render() {
  resizeCanavsToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  // prettier-ignore
  const positions = [
    0,    0.01,
    0.3,  0.01,
    0,   -0.01,
    0,   -0.01,
    0.3,  0.01,
    0.3, -0.01,
    0.3,  0.05,
    0.4,  0,
    0.3, -0.05,
  ];
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const radian = (angle.value * Math.PI) / 180;
  const rotateX = Math.cos(radian);
  const rotateY = Math.sin(radian);
  gl.uniform2fv(rotationLocation, [rotateX, rotateY]);

  gl.drawArrays(gl.TRIANGLES, 0, 9);
}
