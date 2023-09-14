import { requestDevice } from '/common/helper';
import shader from './shader.wgsl';

const device = await requestDevice();
const compute = createCompute(device);

compute([1, 2, 3]);
(window as any).compute = compute;

function createCompute(device: GPUDevice) {
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
    device.queue.writeBuffer(workBuffer, 0, input);

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

    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(input.length);
    pass.end();

    const resultBuffer = device.createBuffer({
      label: 'result buffer',
      size: input.byteLength,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });
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
