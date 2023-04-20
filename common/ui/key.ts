import type { InjectionKey } from 'vue';
import Container from './container.vue';

export const executorKey: InjectionKey<
  (data: InstanceType<typeof Container>['data']) => void
> = Symbol('executor');
