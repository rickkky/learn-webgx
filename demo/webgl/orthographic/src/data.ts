import { createCuboid } from '/common/data';

const cuboidx = createCuboid(30, 100, 0, 25, 0, 25);
const cuboidy = createCuboid(0, 25, 30, 150, 0, 25);
const cuboidz = createCuboid(0, 25, 0, 25, 30, 200);

export default {
  positions: [...cuboidx.positions, ...cuboidy.positions, ...cuboidz.positions],
  positionSize: cuboidx.positionSize,
  colors: [...cuboidx.colors, ...cuboidy.colors, ...cuboidz.colors],
};
