import { createStatehub } from '/common/ui/statehub';

export interface State {
  cx: number;
  cy: number;
  cz: number;
  fov: number;
  enableCullFace: boolean;
  enableDepthTest: boolean;
}

export const statehub = createStatehub<State>({
  name: 'Render',
  payloads: [
    {
      key: 'cx',
      label: 'Camera X',
      type: 'slider',
      props: {
        min: -500,
        max: 500,
      },
      default: 100,
    },
    {
      key: 'cy',
      label: 'Camera Y',
      type: 'slider',
      props: {
        min: 0,
        max: 500,
      },
      default: 300,
    },
    {
      key: 'cz',
      label: 'Camera Z',
      type: 'slider',
      props: {
        min: 300,
        max: 1000,
      },
      default: 600,
    },
    {
      key: 'fov',
      label: 'Field of View',
      type: 'slider',
      props: {
        min: 0,
        max: 180,
      },
      default: 60,
    },
    {
      key: 'enableCullFace',
      label: 'Enable Culling Face',
      type: 'checkbox',
      props: {
        label: '',
      },
      default: true,
    },
    {
      key: 'enableDepthTest',
      label: 'Enable Depth Test',
      type: 'checkbox',
      props: {
        label: '',
      },
      default: true,
    },
  ],
});
