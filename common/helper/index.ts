export * from './resize';
export * from './webgl';
export * from './webgpu';

export function loadImage(imageSource: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = imageSource;
  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject();
  });
}
