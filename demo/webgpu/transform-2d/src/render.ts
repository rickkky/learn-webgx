import { mat3 } from 'vectrix';
import { degreeToRadian } from '/common/helper';
import shader from './shader.wgsl';
import { statehub, State } from './state';
import * as data from './data';

export function createRender(context: GPUCanvasContext, device: GPUDevice) {
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
      buffers: [
        {
          arrayStride: data.positionSize * Float32Array.BYTES_PER_ELEMENT,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: 'float32x2',
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
  });

  const vertexData = new Float32Array(data.positions);
  const vertexBuffer = device.createBuffer({
    label: 'vertex buffer',
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertexData);

  const matrixData = new Float32Array(4 * 3);
  const matrixBuffer = device.createBuffer({
    label: 'matrix buffer',
    size: matrixData.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bindGroup = device.createBindGroup({
    label: 'bind group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: matrixBuffer,
        },
      },
    ],
  });

  const render = (state: State = statehub.state) => {
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
    pass.setVertexBuffer(0, vertexBuffer);

    const matrix = mat3.multiplication([
      projection(context.canvas.width, context.canvas.height),
      mat3.translation(state.tx, state.ty),
      mat3.translation(state.ox, state.oy),
      mat3.rotation(degreeToRadian(state.angle)),
      mat3.scaling(state.sx, state.sy),
      mat3.translation(-state.ox, -state.oy),
    ]);
    const matrixValue = matrix.toArray2D();
    matrixData.set(matrixValue[0]);
    matrixData.set(matrixValue[1], 4);
    matrixData.set(matrixValue[2], 8);
    device.queue.writeBuffer(matrixBuffer, 0, matrixData);

    pass.setBindGroup(0, bindGroup);
    pass.draw(data.positions.length / data.positionSize);
    pass.end();

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);
  };

  return render;
}

function projection(width: number, height: number) {
  const sx = 2 / width;
  // flip y
  const sy = -2 / height;
  const tx = -1;
  const ty = 1;
  // prettier-ignore
  const nums = [
    sx, 0,  0,
    0,  sy, 0,
    tx, ty, 1,
  ]
  return mat3(nums);
}
