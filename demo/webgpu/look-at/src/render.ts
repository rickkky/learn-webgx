import { mat4, vec3, CLIP } from 'vectrix';
import { degreeToRadian } from '/common/helper';
import shader from './shader.wgsl';
import { statehub, State } from './state';
import data from './data';

export function createRender(context: GPUCanvasContext, device: GPUDevice) {
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format: presentationFormat });

  const module = device.createShaderModule({
    label: 'shader module',
    code: shader,
  });

  const vertexData = new Float32Array(data.positions);
  const vertexBuffer = device.createBuffer({
    label: 'vertex buffer',
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertexData);

  const colorData = new Float32Array(data.colors);
  const colorBuffer = device.createBuffer({
    label: 'color buffer',
    size: colorData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(colorBuffer, 0, colorData);

  const matrixData = new Float32Array(4 * 4);
  const matrixBuffer = device.createBuffer({
    label: 'matrix buffer',
    size: matrixData.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  let depthTexture: GPUTexture;

  const render = (state: State = statehub.state) => {
    const pipeline = device.createRenderPipeline({
      label: 'pipline',
      layout: 'auto',
      vertex: {
        module,
        entryPoint: 'vs',
        buffers: [
          {
            arrayStride: data.positionSize * Float32Array.BYTES_PER_ELEMENT,
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: 'float32x3',
              },
            ],
          },
        ],
      },
      fragment: {
        module,
        entryPoint: 'fs',
        targets: [{ format: presentationFormat }],
      },
      primitive: {
        cullMode: state.enableCullFace ? 'back' : 'none',
      },
      depthStencil: {
        depthWriteEnabled: state.enableDepthTest,
        depthCompare: 'less',
        format: 'depth24plus',
      },
    });
    const bindGroup = device.createBindGroup({
      label: 'bind group',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: colorBuffer,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: matrixBuffer,
          },
        },
      ],
    });

    const canvasTexture = context.getCurrentTexture();
    if (
      !depthTexture ||
      depthTexture.width !== canvasTexture.width ||
      depthTexture.height !== canvasTexture.height
    ) {
      if (depthTexture) {
        depthTexture.destroy();
      }
      depthTexture = device.createTexture({
        size: [canvasTexture.width, canvasTexture.height],
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });
    }

    const encoder = device.createCommandEncoder({
      label: 'encoder',
    });
    const pass = encoder.beginRenderPass({
      label: 'render pass',
      colorAttachments: [
        {
          view: canvasTexture.createView(),
          clearValue: [1, 1, 1, 1],
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthClearValue: 1,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      },
    });

    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);

    const matrix = mat4.multiplication([
      mat4.perspective(
        degreeToRadian(state.fov),
        context.canvas.width / context.canvas.height,
        1,
        2000,
        CLIP.WEBGPU,
      ),
      mat4.lookAt(
        vec3(state.cx, state.cy, state.cz),
        vec3(0, 0, 0),
        vec3(0, 1, 0),
      ),
    ]);
    matrixData.set(matrix.toArray());
    device.queue.writeBuffer(matrixBuffer, 0, matrixData);

    pass.setBindGroup(0, bindGroup);
    pass.draw(data.positions.length / data.positionSize);
    pass.end();

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);
  };

  return render;
}
