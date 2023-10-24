import { repeatTriangleColors } from '/common/helper';

export const createCuboid = (
  left: number,
  right: number,
  bottom: number,
  top: number,
  back: number,
  front: number,
) => {
  // prettier-ignore
  const positions = [
    // front
    left,  bottom, front,
    right, bottom, front,
    right, top,    front,

    right, top,    front,
    left,  top,    front,
    left,  bottom, front,

    // back
    left,  bottom, back,
    right, top,    back,
    right, bottom, back,

    right, top,    back,
    left,  bottom, back,
    left,  top,    back,

    // top
    left,  top,    front,
    right, top,    front,
    right, top,    back,

    right, top,    back,
    left,  top,    back,
    left,  top,    front,

    // bottom
    left,  bottom, front,
    right, bottom, back,
    right, bottom, front,

    right, bottom, back,
    left,  bottom, front,
    left,  bottom, back,

    // left
    left,  bottom, back,
    left,  bottom, front,
    left,  top,    front,

    left,  top,    front,
    left,  top,    back,
    left,  bottom, back,

    // right
    right, bottom, back,
    right, top,    front,
    right, bottom, front,

    right, top,    front,
    right, bottom, back,
    right, top,    back,
  ];
  const colors = [
    // front
    ...repeatTriangleColors(2),
    // back
    ...repeatTriangleColors(2),
    // top
    ...repeatTriangleColors(2),
    // bottom
    ...repeatTriangleColors(2),
    // left
    ...repeatTriangleColors(2),
    // right
    ...repeatTriangleColors(2),
  ];
  return {
    positions,
    positionSize: 3,
    colors,
  };
};
