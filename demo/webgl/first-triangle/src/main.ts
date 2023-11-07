import { observeResize } from '/common/helper';
import { createRender } from './render';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;
const render = createRender(gl);

observeResize({ context: gl, callbacks: [render.resize, render] });
