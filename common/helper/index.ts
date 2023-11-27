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

export function createDefer<T>() {
  let resolve: (value: T) => void;
  let reject: (reason?: any) => void;
  const promise = new Promise<T>((s, j) => {
    resolve = s;
    reject = j;
  });
  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
}

export function degreeToRadian(degree: number) {
  return (degree * Math.PI) / 180;
}

export function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function randomColor() {
  return [Math.random() * 256, Math.random() * 256, Math.random() * 256, 255];
}

export function repeatColor(count: number, color = randomColor()) {
  return Array(count).fill(color).flat();
}
