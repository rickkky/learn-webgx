import { createStatehub } from '/common/ui/statehub';

export interface State {
  rx: number;
  ry: number;
  rz: number;
}

export const statehub = createStatehub<State>({
  name: 'Render',
  payloads: [
    {
      key: 'rx',
      label: 'Rotate X ',
      type: 'slider',
      props: {
        min: -360,
        max: 360,
      },
      default: 45,
    },
    {
      key: 'ry',
      label: 'Rotate Y',
      type: 'slider',
      props: {
        min: -360,
        max: 360,
      },
      default: -45,
    },
    {
      key: 'rz',
      label: 'Rotate Z ',
      type: 'slider',
      props: {
        min: -360,
        max: 360,
      },
      default: 0,
    },
  ],
});
