import { createApp } from 'vue';
import Container from './container.vue';
import { executorKey } from './key';

export function createUi(
  props: InstanceType<typeof Container>['$props'],
  executor: (data: InstanceType<typeof Container>['data']) => void,
) {
  const element = document.createElement('div');
  element.id = 'ui';
  document.body.appendChild(element);
  const app = createApp(Container, props);
  app.provide(executorKey, executor);
  app.mount(element);
}
