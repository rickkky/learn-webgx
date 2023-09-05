export function resizeCanavsToDisplaySize(
  canvas: HTMLCanvasElement,
  multiplier = 1,
) {
  const width = Math.floor(canvas.clientWidth * multiplier);
  const height = Math.floor(canvas.clientHeight * multiplier);
  if (canvas.width !== width) {
    canvas.width = width;
  }
  if (canvas.height !== height) {
    canvas.height = height;
  }
}

export function observeResize({
  context,
  device,
  render,
  multiplier = 1,
}: {
  context: WebGL2RenderingContext | GPUCanvasContext;
  device?: GPUDevice;
  render?: () => void;
  multiplier?: number;
}) {
  const canvas = context.canvas as HTMLCanvasElement;
  const limit = device?.limits.maxTextureDimension2D || Infinity;
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    const size = entry.contentBoxSize[0];
    const width = Math.max(
      1,
      Math.min(Math.floor(size.inlineSize * multiplier), limit),
    );
    const height = Math.max(
      1,
      Math.min(Math.floor(size.blockSize * multiplier), limit),
    );
    canvas.width = width;
    canvas.height = height;
    if (WebGL2RenderingContext && context instanceof WebGL2RenderingContext) {
      context.viewport(0, 0, width, height);
    }
    if (render) {
      render();
    }
  });
  observer.observe(canvas);
  return observer;
}
