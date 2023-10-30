import { observeResize } from '/common/helper';
import { statehub } from './state';
import { createRender } from './render';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;
const render = createRender(gl);

statehub.observe(render);
observeResize({ context: gl, callbacks: [render] });
