// prettier-ignore
export const positions = [
  // back
  0,    0,   20,
  0,   -10,  20,
  70,  -10,  20,

  0,    0,   20,
  70,  -10,  20,
  70,   0,   20,

  70,   0,   20,
  70,  -20,  20,
  100,  0,   20,

  // front
  0,    0,   0,
  70,  -10,  0,
  0,   -10,  0,

  0,    0,   0,
  70,   0,   0,
  70,  -10,  0,

  70,   0,   0,
  100,  0,   0,
  70,  -20,  0,

  // left
  0,    0,   20,
  0,   -10,  0,
  0,   -10,  20,

  0,    0,   20,
  0,    0,   0,
  0,   -10,  0,

  70,  -10,  20,
  70,  -20,  0,
  70,  -20,  20,

  70,  -10,  20,
  70,  -10,  0,
  70,  -20,  0,

  // right
  100,  0,   0,
  70,  -20,  20,
  70,  -20,  0,

  100,  0,   0,
  100,  0,   20,
  70,  -20,  20,

  // top
  0,   -10,  0,
  70,  -10,  20,
  0,   -10,  20,

  0,   -10,  0,
  70,  -10,  0,
  70,  -10,  20,

  // bottom
  0,    0,   20,
  100,  0,   0,
  0,    0,   0,

  0,    0,   20,
  100,  0,   20,
  100,  0,   0,
]

export const colors = [
  // back
  ...Array(3 * 3)
    .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
    .flat(),

  // front
  ...Array(3 * 3)
    .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
    .flat(),

  // left
  ...Array(4 * 3)
    .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
    .flat(),

  // right
  ...Array(2 * 3)
    .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
    .flat(),

  // top
  ...Array(2 * 3)
    .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
    .flat(),

  // bottom
  ...Array(2 * 3)
    .fill([Math.random() * 255, Math.random() * 255, Math.random() * 255])
    .flat(),
];
