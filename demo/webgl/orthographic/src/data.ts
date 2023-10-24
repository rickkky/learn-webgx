import { repeatTriangleColors } from '/common/helper';

// prettier-ignore
export const positions = [
  // back
   80, -60, -100,
  -80, -60, -100,
  -80,  60, -100,

  -80,  60, -100,
   80,  60, -100,
   80, -60, -100,

  // front
  -40,  30, -10,
  -40, -30, -10,
   40, -30, -10,

   40, -30, -10,
   40,  30, -10,
  -40,  30, -10,

  // left
  -40,  30, -10,
  -80,  60, -100,
  -80, -60, -100,

  -80, -60, -100,
  -40, -30, -10,
  -40,  30, -10,

  // right
  80, -60, -100,
  80,  60, -100,
  40,  30, -10,

  40,  30, -10,
  40, -30, -10,
  80, -60, -100,

  // top
   40, 30, -10,
   80, 60, -100,
  -80, 60, -100,

  -80, 60, -100,
  -40, 30, -10,
   40, 30, -10,

  // bottom
  -80, -60, -100,
   80, -60, -100,
   40, -30, -10,

   40, -30, -10,
  -40, -30, -10,
  -80, -60, -100,
];

export const positionSize = 3;

export const colors = [
  // back
  ...repeatTriangleColors(2),

  // front
  ...repeatTriangleColors(2),

  // left
  ...repeatTriangleColors(2),

  // right
  ...repeatTriangleColors(2),

  // top
  ...repeatTriangleColors(2),

  // bottom
  ...repeatTriangleColors(2),
];
