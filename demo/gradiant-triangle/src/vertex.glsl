#version 300 es

in vec4 a_position;

out vec4 v_color;

void main() {
  gl_Position = a_position;

  v_color = vec4((gl_Position * 0.5 + 0.5).xy, 0.5, 1);
}
