import { defineConfig } from 'vite';
import { resolve } from 'path';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'random-rectangle': resolve(
          __dirname,
          'demo/random-rectangle/index.html',
        ),
      },
    },
  },
  plugins: [glsl()],
  server: {
    host: true,
  },
});
