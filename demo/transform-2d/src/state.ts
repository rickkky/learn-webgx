import { createStatehub } from '/common/ui/statehub';

export const statehub = await createStatehub();

const ox = statehub.setup({
  label: 'Origin X',
  type: 'slider',
  props: {
    min: 0,
    max: 100,
  },
  default: 0,
});
const oy = statehub.setup({
  label: 'Origin Y',
  type: 'slider',
  props: {
    min: 0,
    max: -15,
  },
  default: 0,
});
const sx = statehub.setup({
  label: 'Scale X',
  type: 'slider',
  props: {
    min: -2,
    max: 2,
  },
  default: 1,
});
const sy = statehub.setup({
  label: 'Scale Y',
  type: 'slider',
  props: {
    min: -2,
    max: 2,
  },
  default: 1,
});
const angle = statehub.setup({
  label: 'Angle',
  type: 'slider',
  props: {
    min: 0,
    max: 360,
  },
  default: 45,
});
const tx = statehub.setup({
  label: 'Translate X',
  type: 'slider',
  props: {
    min: 0,
    max: 200,
  },
  default: 100,
});
const ty = statehub.setup({
  label: 'Translate Y',
  type: 'slider',
  props: {
    min: 0,
    max: 200,
  },
  default: 100,
});

export const state = {
  get ox() {
    return ox.value;
  },
  get oy() {
    return oy.value;
  },
  get sx() {
    return sx.value;
  },
  get sy() {
    return sy.value;
  },
  get angle() {
    return angle.value;
  },
  get tx() {
    return tx.value;
  },
  get ty() {
    return ty.value;
  },
};
