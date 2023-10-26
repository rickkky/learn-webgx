import { repeatColor, random } from '/common/helper';

export const createRandomTriangle = (
  left: number,
  right: number,
  bottom: number,
  top: number,
) => {
  const positions = [
    random(left, right),
    random(bottom, top),
    random(left, right),
    random(bottom, top),
    random(left, right),
    random(bottom, top),
  ];
  return positions;
};

createRandomTriangle.positionSize = 2;

export const createTriangleColors = (countPerInstance: number) => {
  const colors = [...repeatColor(countPerInstance)];
  return colors;
};

createTriangleColors.colorSize = 4;
