import { requestDevice, observeResize } from '/common/helper';
import { createRender } from './render';
import { statehub } from './state';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const context = canvas.getContext('webgpu')!;
const device = await requestDevice();
const render = createRender(context, device);

statehub.observe(render);
observeResize({ context, callbacks: [render] });
