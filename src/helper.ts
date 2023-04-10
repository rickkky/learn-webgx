export function resizeCanavsToDisplaySize(
  canvas: HTMLCanvasElement,
  multiplier = 1,
) {
  const width = Math.floor(canvas.clientWidth * multiplier);
  const height = Math.floor(canvas.clientHeight * multiplier);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

export function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    gl.deleteShader(shader);
    throw new Error(`Could not compile shader: ${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader | string,
  fragmentShader: WebGLShader | string,
) {
  const program = gl.createProgram()!;
  if (typeof vertexShader === 'string') {
    vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
  }
  if (typeof fragmentShader === 'string') {
    fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    gl.deleteProgram(program);
    throw new Error(`Could create program: ${gl.getProgramInfoLog(program)}`);
  }
  return program;
}
