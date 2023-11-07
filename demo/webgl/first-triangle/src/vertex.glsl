#version 300 es

in vec2 a_position;
in vec4 a_color;
in float a_scale;
in vec2 a_offset;

uniform vec2 u_resolution;

out vec4 v_color;

void main() {
  vec2 positionTransformed = a_position * a_scale + a_offset;
  vec2 positionClipspace = positionTransformed / u_resolution * 2.0 - 1.0;
  gl_Position = vec4(positionClipspace * vec2(1, -1), 0, 1);

  v_color = a_color;
}