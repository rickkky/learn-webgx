import { createApp } from 'vue';
import Container from './container.vue';
import type { ContainerProps } from './container.vue';

function createUi(props: ContainerProps) {
  const element = document.createElement('div');
  const app = createApp(Container);
}
