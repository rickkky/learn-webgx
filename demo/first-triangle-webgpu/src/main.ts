import { requestDevice, observeResize } from '/common/helper';
import shader from './shader.wgsl';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const context = canvas.getContext('webgpu')!;
const device = await requestDevice();
const render = createRender(context, device);

observeResize({ context, device, render });

function createRender(context: GPUCanvasContext, device: GPUDevice) {
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format: presentationFormat });

  const module = device.createShaderModule({
    label: 'shader module',
    code: shader,
  });
  const pipeline = device.createRenderPipeline({
    label: 'pipline',
    layout: 'auto',
    vertex: {
      module,
      entryPoint: 'vs',
    },
    fragment: {
      module,
      entryPoint: 'fs',
      targets: [{ format: presentationFormat }],
    },
  });

  return () => {
    const encoder = device.createCommandEncoder({
      label: 'encoder',
    });
    const pass = encoder.beginRenderPass({
      label: 'render pass',
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: [1, 1, 1, 1],
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    });

    pass.setPipeline(pipeline);
    pass.draw(3);
    pass.end();

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);
  };
}
