import shader from './shader.wgsl';
import data from './data';

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

  const scalingData = new Float32Array(data.scalings);
  const scalingBuffer = device.createBuffer({
    label: 'scaling buffer',
    size: scalingData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const offsetData = new Float32Array(data.offsets);
  const offsetBuffer = device.createBuffer({
    label: 'offset buffer',
    size: offsetData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const colorData = new Float32Array(data.colors);
  const colorBuffer = device.createBuffer({
    label: 'color buffer',
    size: colorData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const resolutionData = new Float32Array([
    context.canvas.width,
    context.canvas.height,
  ]);
  const resolutionBuffer = device.createBuffer({
    label: 'resolution buffer',
    size: resolutionData.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bindGroup = device.createBindGroup({
    label: 'bind group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: scalingBuffer,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: offsetBuffer,
        },
      },
      {
        binding: 2,
        resource: {
          buffer: colorBuffer,
        },
      },
      {
        binding: 3,
        resource: {
          buffer: resolutionBuffer,
        },
      },
    ],
  });

  const resize = () => {
    data.update(context.canvas.width, context.canvas.height);
    vertexData.set(data.positions);
    device.queue.writeBuffer(vertexBuffer, 0, vertexData);
    scalingData.set(data.scalings);
    device.queue.writeBuffer(scalingBuffer, 0, scalingData);
    offsetData.set(data.offsets);
    device.queue.writeBuffer(offsetBuffer, 0, offsetData);
    colorData.set(data.colors);
    device.queue.writeBuffer(colorBuffer, 0, colorData);
    resolutionData.set([context.canvas.width, context.canvas.height]);
    device.queue.writeBuffer(resolutionBuffer, 0, resolutionData);
  };

  const render = () => {
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
    pass.setBindGroup(0, bindGroup);
    pass.draw(data.positions.length / data.positionSize, data.count);
    pass.end();

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);
  };

  render.resize = resize;

  return render;
}
