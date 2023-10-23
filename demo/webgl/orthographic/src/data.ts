import { randomColors } from '/common/helper';

// // prettier-ignore
// export const positions = [
//   // back
//   0,    0,   20,
//   0,   -10,  20,
//   70,  -10,  20,

//   0,    0,   20,
//   70,  -10,  20,
//   70,   0,   20,

//   70,   0,   20,
//   70,  -20,  20,
//   100,  0,   20,

//   // front
//   0,    0,   0,
//   70,  -10,  0,
//   0,   -10,  0,

//   0,    0,   0,
//   70,   0,   0,
//   70,  -10,  0,

//   70,   0,   0,
//   100,  0,   0,
//   70,  -20,  0,

//   // left
//   0,    0,   20,
//   0,   -10,  0,
//   0,   -10,  20,

//   0,    0,   20,
//   0,    0,   0,
//   0,   -10,  0,

//   70,  -10,  20,
//   70,  -20,  0,
//   70,  -20,  20,

//   70,  -10,  20,
//   70,  -10,  0,
//   70,  -20,  0,

//   // right
//   100,  0,   0,
//   70,  -20,  20,
//   70,  -20,  0,

//   100,  0,   0,
//   100,  0,   20,
//   70,  -20,  20,

//   // top
//   0,   -10,  0,
//   70,  -10,  20,
//   0,   -10,  20,

//   0,   -10,  0,
//   70,  -10,  0,
//   70,  -10,  20,

//   // bottom
//   0,    0,   20,
//   100,  0,   0,
//   0,    0,   0,

//   0,    0,   20,
//   100,  0,   20,
//   100,  0,   0,
// ];

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
  ...randomColors(2),

  // front
  ...randomColors(2),

  // left
  ...randomColors(2),

  // right
  ...randomColors(2),

  // top
  ...randomColors(2),

  // bottom
  ...randomColors(2),
];

// export const colors = [
//   // back
//   ...Array(3 * 3)
//     .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
//     .flat(),

//   // front
//   ...Array(3 * 3)
//     .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
//     .flat(),

//   // left
//   ...Array(4 * 3)
//     .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
//     .flat(),

//   // right
//   ...Array(2 * 3)
//     .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
//     .flat(),

//   // top
//   ...Array(2 * 3)
//     .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
//     .flat(),

//   // bottom
//   ...Array(2 * 3)
//     .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
//     .flat(),
// ];
