#version 300 es

in vec4 a_position;

uniform vec2 u_translation;

void main() {
  gl_Position = a_position + vec4(u_translation, 0, 0);
}