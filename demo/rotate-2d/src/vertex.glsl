#version 300 es

in vec4 a_position;

uniform vec2 u_rotation;

void main() {
  gl_Position = vec4(
    a_position.x * u_rotation.x - a_position.y * u_rotation.y,
    a_position.x * u_rotation.y + a_position.y * u_rotation.x,
    0,
    1
  );
}