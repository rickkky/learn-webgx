struct Vertex {
  @location(0) position: vec2f,
};

@group(0) @binding(0) var<uniform> matrix: mat3x3f;

@vertex fn vs(
  vertex: Vertex,
) -> @builtin(position) vec4f {
  let positionClipspace = (matrix * vec3f(vertex.position, 1.0)).xy;
  return vec4f(positionClipspace, 0.0, 1.0);
}

@fragment fn fs() -> @location(0) vec4f {
  return vec4f(1.0, 0.0, 0.0, 1.0);
}