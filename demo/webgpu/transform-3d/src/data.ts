import { createCuboid, createCuboidColors } from '/common/data';

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

export default {
  positions,
  positionSize: createCuboid.positionSize,
  colors,
  colorSize: createCuboidColors.colorSize,
};
