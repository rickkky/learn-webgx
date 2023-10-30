struct Vertex {
  position: vec2f,
};

struct TransformInfo {
  scale: f32,
  offset: vec2f,
};

struct RenderInfo {
  color: vec4f,
};

struct Varing {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
};

@group(0) @binding(0) var<storage, read> vertices: array<Vertex>;
@group(0) @binding(1) var<storage, read> transformInfos: array<TransformInfo>;
@group(0) @binding(2) var<storage, read> renderInfos: array<RenderInfo>;

@vertex fn vs(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32,
) -> Varing {
  let vertex = vertices[vertexIndex];
  let transformInfo = transformInfos[instanceIndex];
  let scale = transformInfo.scale;
  let offset = transformInfo.offset;
  let renderInfo = renderInfos[instanceIndex];
  let color = renderInfo.color;
  var varing: Varing;
  varing.position = vec4f(vertex.position * scale + offset, 0.0, 1.0);
  varing.color = renderInfo.color;
  return varing;
}

@fragment fn fs(@location(0) color: vec4f) -> @location(0) vec4f {
  return color;
}