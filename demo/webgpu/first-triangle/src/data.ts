import { randomColor, random } from '/common/helper';

const createData = (
  count: number,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const triangleWidth = canvasWidth / 15;
  const triangleHeight = canvasHeight / 15;
  // prettier-ignore
  const positions = [
     0,            -triangleHeight,
    -triangleWidth, triangleHeight,
     triangleWidth, triangleHeight,
  ];
  const scalings = [];
  const offsets = [];
  const colors = [];
  for (let i = 0; i < count; i++) {
    const scale = random(0.5, 2);
    scalings.push(scale);
    const offset = [
      random(0, canvasWidth + triangleWidth),
      random(0, canvasHeight + triangleHeight),
    ];
    offsets.push(...offset);
    const color = [...randomColor(), ...randomColor(), ...randomColor()];
    colors.push(...color);
  }
  return {
    count,
    positions,
    positionSize: 2,
    scalings,
    scalingSize: 1,
    offsets,
    offsetSize: 2,
    colors,
    colorSize: 4,
  };
};

const count = 50;

const data = {
  ...createData(count, 0, 0),
  update(width: number, height: number) {
    Object.assign(data, createData(count, width, height));
  },
};

export default data;
