import { vec3, mat4 } from 'vectrix';
import { createProgram, degreeToRadian } from '/common/helper';
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
import data from './data';
import { statehub, State } from './state';

export function createRender(gl: WebGL2RenderingContext) {
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const positionBuffer = gl.createBuffer();
  const positions = data.positions;
  const positionSize = data.positionSize;
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, positionSize, gl.FLOAT, false, 0, 0);

  const colorLocation = gl.getAttribLocation(program, 'a_color');
  const colorBuffer = gl.createBuffer();
  const colors = data.colors;
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(colorLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

  const normalLocation = gl.getAttribLocation(program, 'a_normal');
  const normalBuffer = gl.createBuffer();
  const normals = data.normals;
  gl.enableVertexAttribArray(normalLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

  const worldViewProjectionMatrixLocation = gl.getUniformLocation(
    program,
    'u_worldViewProjectionMatrix',
  );
  const worldInverseTransposeMatrixLocation = gl.getUniformLocation(
    program,
    'u_worldInverseTransposeMatrix',
  );

  const directionalLightReverseDirectionLocation = gl.getUniformLocation(
    program,
    'u_directionalLightReverseDirection',
  );
  gl.uniform3fv(
    directionalLightReverseDirectionLocation,
    vec3(1, -0.5, 2).normalize().toArray(),
  );

  const render = (state: State = statehub.state) => {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const cameraMatrix = mat4.targetTo(
      vec3(0, 0, 600),
      vec3(0, 0, 0),
      vec3(0, 1, 0),
    );
    const viewMatrix = mat4.invert(cameraMatrix);
    const projectionMatrix = mat4.perspective(
      degreeToRadian(60),
      gl.canvas.width / gl.canvas.height,
      1,
      2000,
    );
    const viewProjectionMatrix = mat4.multiply(projectionMatrix, viewMatrix);
    const worldMatrix = mat4.multiplication([
      mat4.rotation(
        degreeToRadian(state.rx),
        degreeToRadian(state.ry),
        degreeToRadian(state.rz),
      ),
    ]);
    const worldViewProjectionMatrix = mat4.multiply(
      viewProjectionMatrix,
      worldMatrix,
    );
    const worldInverseTransposeMatrix = mat4.transpose(
      mat4.invert(worldMatrix),
    );
    gl.uniformMatrix4fv(
      worldViewProjectionMatrixLocation,
      false,
      worldViewProjectionMatrix.toArray(),
    );
    gl.uniformMatrix4fv(
      worldInverseTransposeMatrixLocation,
      false,
      worldInverseTransposeMatrix.toArray(),
    );

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / positionSize);
  };

  return render;
}
