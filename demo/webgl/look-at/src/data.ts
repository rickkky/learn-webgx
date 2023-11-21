import { createCuboid, createCuboidColors } from '/common/data';

export default {
  positions: [
    ...createCuboid(50, 150, 0, 40, 0, 40),
    ...createCuboid(0, 40, 50, 200, 0, 40),
    ...createCuboid(0, 40, 0, 40, 50, 250),
  ],
  positionSize: createCuboid.positionSize,
  colors: [
    ...createCuboidColors(3),
    ...createCuboidColors(3),
    ...createCuboidColors(3),
  ],
  colorSize: createCuboidColors.colorSize,
};
