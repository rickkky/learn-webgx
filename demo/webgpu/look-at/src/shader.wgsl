struct Vertex {
  @location(0) position: vec3f,
};

struct Varing {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
};

@group(0) @binding(0) var<storage> colors: array<vec4f>;
@group(0) @binding(1) var<uniform> matrix: mat4x4f;

@vertex fn vs(
  vertex: Vertex,
  @builtin(vertex_index) vertexIndex: u32,
) -> Varing {
  var varing: Varing;
  varing.position = matrix * vec4f(vertex.position, 1.0);
  varing.color = colors[vertexIndex];
  return varing;
}

@fragment fn fs(@location(0) color: vec4f) -> @location(0) vec4f {
  return vec4f(color / 255.0);
}