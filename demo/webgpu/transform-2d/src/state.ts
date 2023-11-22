import { createStatehub } from '/common/ui/statehub';

export interface State {
  ox: number;
  oy: number;
  sx: number;
  sy: number;
  angle: number;
  tx: number;
  ty: number;
}

export const statehub = createStatehub<State>({
  name: 'Render',
  payloads: [
    {
      key: 'ox',
      label: 'Origin X',
      type: 'slider',
      props: {
        min: 0,
        max: 100,
      },
      default: 0,
    },
    {
      key: 'oy',
      label: 'Origin Y',
      type: 'slider',
      props: {
        min: 0,
        max: -15,
      },
      default: 0,
    },
    {
      key: 'sx',
      label: 'Scale X',
      type: 'slider',
      props: {
        min: -2,
        max: 2,
      },
      default: 1,
    },
    {
      key: 'sy',
      label: 'Scale Y',
      type: 'slider',
      props: {
        min: -2,
        max: 2,
      },
      default: 1,
    },
    {
      key: 'angle',
      label: 'Angle',
      type: 'slider',
      props: {
        min: 0,
        max: 360,
      },
      default: 45,
    },
    {
      key: 'tx',
      label: 'Translate X',
      type: 'slider',
      props: {
        min: 0,
        max: 200,
      },
      default: 100,
    },
    {
      key: 'ty',
      label: 'Translate Y',
      type: 'slider',
      props: {
        min: 0,
        max: 200,
      },
      default: 100,
    },
  ],
});
