import { randomColor, random } from '/common/helper';

export const createRandomTriangles = (
  count: number,
  perInstance: number,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const positions = [];
  const colors = [];
  const scales = [];
  const offsets = [];
  const tw = canvasWidth / 15;
  const th = canvasHeight / 15;
  // prettier-ignore
  const singlePositions = [
     0, -th,
    -tw, th,
     tw, th,
  ];
  for (let i = 0; i < count; i++) {
    positions.push(...singlePositions);
    colors.push(...randomColor(), ...randomColor(), ...randomColor());
    const scale = random(0.5, 2);
    scales.push(...Array(perInstance).fill(scale));
    const offset = [random(0, canvasWidth + tw), random(0, canvasHeight + th)];
    offsets.push(...Array(perInstance).fill(offset).flat());
  }
  return {
    positionCount: positions.length / 2,
    positions,
    positionSize: 2,
    colors,
    colorSize: 4,
    scales,
    scaleSize: 1,
    offsets,
    offsetSize: 2,
  };
};
