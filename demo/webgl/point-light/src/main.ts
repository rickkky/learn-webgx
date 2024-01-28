import { observeResize } from '/common/helper';
import { createRender } from './render';
import { statehub } from './state';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;
const render = createRender(gl);

statehub.observe(render);
observeResize({ context: gl, callbacks: [render] });
