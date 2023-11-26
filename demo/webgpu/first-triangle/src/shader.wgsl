struct Vertex {
  @location(0) position: vec2f,
};

struct Varing {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
};

@group(0) @binding(0) var<storage, read> scalings: array<f32>;
@group(0) @binding(1) var<storage, read> offsets: array<vec2f>;
@group(0) @binding(2) var<storage, read> colors: array<vec4f>;
@group(0) @binding(3) var<uniform> resolution: vec2f;

@vertex fn vs(
  vertex: Vertex,
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32,
) -> Varing {
  let scaling = scalings[instanceIndex];
  let offset = offsets[instanceIndex];
  let positionTransformed = vertex.position * scaling + offset;
  let positionClipspace = positionTransformed / resolution * 2.0 - 1.0;
  let color = colors[instanceIndex * 3 + vertexIndex];
  var varing: Varing;
  varing.position = vec4f(positionClipspace.x, -positionClipspace.y, 0.0, 1.0);
  varing.color = color;
  return varing;
}

@fragment fn fs(@location(0) color: vec4f) -> @location(0) vec4f {
  return color / 255.0;
}