import { createStatehub } from '/common/ui/statehub';

export interface State {
  ox: number;
  oy: number;
  oz: number;
  sx: number;
  sy: number;
  sz: number;
  rx: number;
  ry: number;
  rz: number;
  tx: number;
  ty: number;
  tz: number;
  fov: number;
  enableCullFace: boolean;
  enableDepthTest: boolean;
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
        min: -20,
        max: 0,
      },
      default: 0,
    },
    {
      key: 'oz',
      label: 'Origin Z',
      type: 'slider',
      props: {
        min: 0,
        max: 100,
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
      key: 'sz',
      label: 'Scale Z',
      type: 'slider',
      props: {
        min: -2,
        max: 2,
      },
      default: 1,
    },
    {
      key: 'rx',
      label: 'Rotate X ',
      type: 'slider',
      props: {
        min: -360,
        max: 360,
      },
      default: -45,
    },
    {
      key: 'ry',
      label: 'Rotate Y',
      type: 'slider',
      props: {
        min: -360,
        max: 360,
      },
      default: 45,
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
    {
      key: 'tx',
      label: 'Translate X',
      type: 'slider',
      props: {
        min: -400,
        max: 400,
      },
      default: 0,
    },
    {
      key: 'ty',
      label: 'Translate Y',
      type: 'slider',
      props: {
        min: -400,
        max: 400,
      },
      default: 0,
    },
    {
      key: 'tz',
      label: 'Translate Z',
      type: 'slider',
      props: {
        min: -2000,
        max: 0,
      },
      default: -600,
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
