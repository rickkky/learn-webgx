import { vec3 } from 'vectrix';

export function createNormals(positions: number[]) {
  const normals: number[] = [];
  for (let i = 0; i < positions.length; i += 9) {
    const a = vec3(positions[i], positions[i + 1], positions[i + 2]);
    const b = vec3(positions[i + 3], positions[i + 4], positions[i + 5]);
    const c = vec3(positions[i + 6], positions[i + 7], positions[i + 8]);
    const ab = vec3.subtract(b, a);
    const bc = vec3.subtract(c, b);
    const normal = vec3.cross(ab, bc).normalize();
    normals.push(...normal, ...normal, ...normal);
  }
  return normals;
}

createNormals.normalSize = 3;
