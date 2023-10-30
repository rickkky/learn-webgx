import { createRandomTriangles } from '/common/data';

const data = {
  ...createRandomTriangles(0, 0, 0, 0),
  update(width: number, height: number) {
    Object.assign(data, createRandomTriangles(50, 3, width, height));
  },
};

export default data;
