import { resizeCanavsToDisplaySize, createProgram } from '@/common/helper';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;

// Make the canvas the same size as the display size.
resizeCanavsToDisplaySize(gl.canvas as HTMLCanvasElement);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas.
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Create a program.
const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
// Set it as the current program.
gl.useProgram(program);

// Create a vertex array object
// which represents a set of vertex data;
const vao = gl.createVertexArray();
// And make it the one we're currently working with.
// Calls to `bindBuffer` or `vertexAttribPointer` will be "recorded" in the VAO.
gl.bindVertexArray(vao);

// Get the location of the `a_position` attribute in the vertex shader.
const positionLocation = gl.getAttribLocation(program, 'a_position');
// Turn on the attribute
gl.enableVertexAttribArray(positionLocation);
// Create a buffer.
const positionBuffer = gl.createBuffer();
// Bind it to `ARRAY_BUFFER` bind point.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// Vertex data.
const positions = [0, 0, 0, 0.5, 1, 0];
// Put the data in the buffer.
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
// Specify how to pull the data out of the buffer.
// It implicitly binds the current `ARRAY_BUFFER` to the attribute.
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Render primitives from array data by executing the shader program.
gl.drawArrays(gl.TRIANGLES, 0, 3);
