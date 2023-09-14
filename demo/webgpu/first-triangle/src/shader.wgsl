
struct VSOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
};

@vertex fn vs(
  @builtin(vertex_index) vertexIndex : u32
) -> VSOutput {
  let pos = array(
    vec2f( 0.0,  0.6),
    vec2f(-0.6, -0.6),
    vec2f( 0.6, -0.6),
  );
  var color = array<vec4f, 3>(
    vec4f(1.0, 0.0, 0.0, 1.0),
    vec4f(0.0, 1.0, 0.0, 1.0),
    vec4f(0.0, 0.0, 1.0, 1.0),
  );
  var vsOutput: VSOutput;
  vsOutput.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  vsOutput.color = color[vertexIndex];
  return vsOutput;
}

@fragment fn fs(fsInput: VSOutput) -> @location(0) vec4f {
  return fsInput.color;
}