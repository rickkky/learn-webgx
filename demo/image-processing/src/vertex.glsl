#version 300 es

in vec4 a_position;
in vec2 a_texCoord;

uniform vec2 u_resolution;
uniform float u_flipY;

out vec2 v_texCoord;

void main() {
  vec2 zeroToOne = a_position.xy / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);

  v_texCoord = a_texCoord;
}
