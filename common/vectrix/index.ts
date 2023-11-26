import * as vectrix from 'vectrix';
import * as t2d from './transform-2d';
import * as t3d from './transform-3d';

const mat3 = Object.assign(vectrix.mat3, {
  translation: t2d.translation,
  rotation: t2d.rotation,
  scaling: t2d.scaling,
  projection: t2d.projection,
});

const mat4 = Object.assign(vectrix.mat4, {
  translation: t3d.translation,
  rotation: t3d.rotation,
  scaling: t3d.scaling,
  orthographic: t3d.orthographic,
  perspective: t3d.perspective,
  lookAt: t3d.lookAt,
});

export { mat3, mat4 };
export { CLIPSPACE } from './transform-3d';
export { vec2, vec3, vec4, mat2, PRECISION } from 'vectrix';
