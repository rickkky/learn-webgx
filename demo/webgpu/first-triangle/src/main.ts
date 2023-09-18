import { requestDevice, observeResize } from '/common/helper';
import { createRender } from './render';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const context = canvas.getContext('webgpu')!;
const device = await requestDevice();
const render = createRender(context, device);

observeResize({ context, device, render });
