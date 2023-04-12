import { defineConfig } from 'vite';
import { resolve } from 'path';
import glsl from 'vite-plugin-glsl';
import tsconfig from './tsconfig.json';

const alias = Object.entries(tsconfig.compilerOptions.paths).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key.replace('/*', '')]: resolve(
      __dirname,
      value[0].replace('/*', '').replace('*', ''),
    ),
  }),
  {},
);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias,
  },
  plugins: [glsl()],
  server: {
    host: true,
  },
});
