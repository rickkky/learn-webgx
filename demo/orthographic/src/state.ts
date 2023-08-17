import { createStatehub } from '/common/statehub';

export const statehub = await createStatehub();

export const ox = statehub.setup({
  label: 'Origin X',
  type: 'slider',
  props: {
    min: 0,
    max: 100,
  },
  default: 0,
});
export const oy = statehub.setup({
  label: 'Origin Y',
  type: 'slider',
  props: {
    min: -20,
    max: 0,
  },
  default: 0,
});
export const oz = statehub.setup({
  label: 'Origin Z',
  type: 'slider',
  props: {
    min: 0,
    max: 20,
  },
  default: 10,
});
export const sx = statehub.setup({
  label: 'Scale X',
  type: 'slider',
  props: {
    min: -2,
    max: 2,
  },
  default: 1,
});
export const sy = statehub.setup({
  label: 'Scale Y',
  type: 'slider',
  props: {
    min: -2,
    max: 2,
  },
  default: 1,
});
export const sz = statehub.setup({
  label: 'Scale Z',
  type: 'slider',
  props: {
    min: -2,
    max: 2,
  },
  default: 1,
});
export const rx = statehub.setup({
  label: 'Rotate X ',
  type: 'slider',
  props: {
    min: -360,
    max: 360,
  },
  default: 45,
});
export const ry = statehub.setup({
  label: 'Rotate Y',
  type: 'slider',
  props: {
    min: -360,
    max: 360,
  },
  default: 45,
});
export const rz = statehub.setup({
  label: 'Rotate Z ',
  type: 'slider',
  props: {
    min: -360,
    max: 360,
  },
  default: -45,
});
export const tx = statehub.setup({
  label: 'Translate X',
  type: 'slider',
  props: {
    min: 0,
    max: 200,
  },
  default: 100,
});
export const ty = statehub.setup({
  label: 'Translate Y',
  type: 'slider',
  props: {
    min: 0,
    max: 200,
  },
  default: 100,
});
export const tz = statehub.setup({
  label: 'Translate Z',
  type: 'slider',
  props: {
    min: -20,
    max: 20,
  },
  default: 0,
});
export const enableCullFace = statehub.setup({
  label: 'Enable Culling Face',
  type: 'checkbox',
  props: {
    label: '',
  },
  default: true,
});
export const enableDepthTest = statehub.setup({
  label: 'Enable Depth Test',
  type: 'checkbox',
  props: {
    label: '',
  },
  default: true,
});

export const state = {
  get ox() {
    return ox.value;
  },
  get oy() {
    return oy.value;
  },
  get oz() {
    return oz.value;
  },
  get sx() {
    return sx.value;
  },
  get sy() {
    return sy.value;
  },
  get sz() {
    return sz.value;
  },
  get rx() {
    return rx.value;
  },
  get ry() {
    return ry.value;
  },
  get rz() {
    return rz.value;
  },
  get tx() {
    return tx.value;
  },
  get ty() {
    return ty.value;
  },
  get tz() {
    return tz.value;
  },
  get enableCullFace() {
    return enableCullFace.value;
  },
  get enableDepthTest() {
    return enableDepthTest.value;
  },
};
