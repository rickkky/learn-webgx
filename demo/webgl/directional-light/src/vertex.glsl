#version 300 es

in vec4 a_position;
in vec4 a_color;
in vec3 a_normal;

uniform mat4 u_worldViewProjectionMatrix;
uniform mat4 u_worldInverseTransposeMatrix;

out vec4 v_color;
out vec3 v_normal;

void main() {
  gl_Position = u_worldViewProjectionMatrix * a_position;

  v_color = a_color;

  v_normal = (u_worldInverseTransposeMatrix * vec4(a_normal, 0)).xyz;
}
