import shader from './shader.wgsl';

const compute = await createCompute();

compute([1, 2, 3]);

async function createCompute() {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter!.requestDevice();

  const module = device.createShaderModule({
    label: 'shader module',
    code: shader,
  });
  const pipeline = device.createComputePipeline({
    label: 'pipline',
    layout: 'auto',
    compute: {
      module,
      entryPoint: 'computeSomething',
    },
  });

  return async (data: number[]) => {
    const input = new Float32Array(data);
    const workBuffer = device.createBuffer({
      label: 'work buffer',
      size: input.byteLength,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });
    const resultBuffer = device.createBuffer({
      label: 'result buffer',
      size: input.byteLength,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });
    const bindGroup = device.createBindGroup({
      label: 'bind group',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: workBuffer,
          },
        },
      ],
    });
    const encoder = device.createCommandEncoder({
      label: 'encoder',
    });
    const pass = encoder.beginComputePass({
      label: 'compute pass',
    });

    device.queue.writeBuffer(workBuffer, 0, input);
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(input.length);
    pass.end();
    encoder.copyBufferToBuffer(
      workBuffer,
      0,
      resultBuffer,
      0,
      resultBuffer.size,
    );

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    await resultBuffer.mapAsync(GPUMapMode.READ);
    const result = new Float32Array(resultBuffer.getMappedRange());
    console.log('input', input.toString());
    console.log('result', result.toString());
    resultBuffer.unmap();
  };
}
