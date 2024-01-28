#version 300 es

precision highp float;

uniform float u_shininess;

in vec4 v_color;
in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToCamera;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToCameraDirection = normalize(v_surfaceToCamera);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToCameraDirection);
  float light = dot(normal, surfaceToLightDirection);
  float specular = 0.0;
  if (light > 0.0) {
    specular = pow(dot(normal, halfVector), u_shininess);
  }
  outColor = v_color;
  outColor.rgb *= light;
  outColor.rgb += specular;
}
