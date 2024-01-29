import { createStatehub } from '/common/ui/statehub';

export interface State {
  plx: number;
  ply: number;
  plz: number;
  shininess: number;
  rh: number;
  rv: number;
  radius: number;
}

export const statehub = createStatehub<State>({
  name: 'Render',
  payloads: [
    {
      key: 'plx',
      label: 'Point Light X',
      type: 'slider',
      props: {
        min: -500,
        max: 500,
      },
      default: -20,
    },
    {
      key: 'ply',
      label: 'Point Light Y',
      type: 'slider',
      props: {
        min: -500,
        max: 500,
      },
      default: 80,
    },
    {
      key: 'plz',
      label: 'Point Light Z',
      type: 'slider',
      props: {
        min: -500,
        max: 500,
      },
      default: 100,
    },
    {
      key: 'shininess',
      label: 'Shininess',
      type: 'slider',
      props: {
        min: 1,
        max: 1000,
      },
      default: 50,
    },
    {
      key: 'rh',
      label: 'Rotation Horizontal',
      type: 'slider',
      props: {
        min: 0,
        max: 360,
      },
      default: 45,
    },
    {
      key: 'rv',
      label: 'Rotation Vertical',
      type: 'slider',
      props: {
        min: 0,
        max: 360,
      },
      default: 45,
    },
    {
      key: 'radius',
      label: 'Radius',
      type: 'slider',
      props: {
        min: 0,
        max: 1000,
      },
      default: 600,
    },
  ],
});
