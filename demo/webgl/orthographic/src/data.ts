import { createCuboid, createCuboidColors } from '/common/data';

export default {
  positions: [
    ...createCuboid(40, 100, 0, 35, 0, 35),
    ...createCuboid(0, 35, 40, 150, 0, 35),
    ...createCuboid(0, 35, 0, 35, 40, 200),
  ],
  positionSize: createCuboid.positionSize,
  colors: [
    ...createCuboidColors(3),
    ...createCuboidColors(3),
    ...createCuboidColors(3),
  ],
  colorSize: createCuboidColors.colorSize,
};
