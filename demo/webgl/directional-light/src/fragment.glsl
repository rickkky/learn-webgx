#version 300 es

precision highp float;

in vec4 v_color;

in vec3 v_normal;

uniform vec3 u_directionalLightDirection;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);

  float light = dot(normal, u_directionalLightDirection);

  outColor = v_color;

  outColor.rgb *= light;
}
