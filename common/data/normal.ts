import { vec3 } from 'vectrix';

export function createNormals(positions: number[]) {
  const normals: number[] = [];
  for (let i = 0; i < positions.length / 3; i++) {
    const a = vec3(positions, i * 3);
    const b = vec3(positions, i * 3 + 1);
    const c = vec3(positions, i * 3 + 2);
    const ab = vec3.subtract(b, a);
    const bc = vec3.subtract(c, b);
    const normal = vec3.cross(ab, bc);
    normals.push(...normal.toArray(), ...normal.toArray(), ...normal.toArray());
  }
  return normals;
}

createNormals.normalSize = 3;
