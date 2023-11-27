import { createCuboid, createCuboidColors, createNormals } from '/common/data';

const positions = [
  ...createCuboid(50, 150, 0, 40, 0, 40),
  ...createCuboid(0, 40, 50, 200, 0, 40),
  ...createCuboid(0, 40, 0, 40, 50, 250),
];

const colors = [
  ...createCuboidColors(),
  ...createCuboidColors(),
  ...createCuboidColors(),
];

const normals = createNormals(positions);

export default {
  positions,
  positionSize: createCuboid.positionSize,
  colors,
  colorSize: createCuboidColors.colorSize,
  normals,
  normalSize: createNormals.normalSize,
};
