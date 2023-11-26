struct Vertex {
  @location(0) position: vec2f,
};

struct Varing {
  @builtin(position) position: vec4f,
};

@group(0) @binding(0) var<uniform> matrix: mat3x3f;

@vertex fn vs(
  vertex: Vertex,
) -> Varing {
  var varing: Varing;
  varing.position = vec4f((matrix * vec3f(vertex.position, 1.0)).xy, 0.0, 1.0);
  return varing;
}

@fragment fn fs() -> @location(0) vec4f {
  return vec4f(1.0, 0.0, 0.0, 1.0);
}