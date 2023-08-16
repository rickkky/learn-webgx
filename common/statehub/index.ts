import { createApp, type Ref } from 'vue';
import { WIDGET_MAP, IK_PREPARE } from './constant';
import Statehub from './statehub.vue';

export type WidgetMap = {
  [key in keyof typeof WIDGET_MAP]: (typeof WIDGET_MAP)[key];
};

export interface WidgetPayload<K extends string, T extends keyof WidgetMap> {
  label: K;
  type: T;
  props: Omit<InstanceType<WidgetMap[T]>['$props'], 'modelValue'>;
  default: InstanceType<WidgetMap[T]>['$props']['modelValue'];
}

export type WidgetPayloadList = WidgetPayload<string, keyof WidgetMap>[];

export type StatehubExposed = {
  setup: <T extends keyof WidgetMap>(
    payload: WidgetPayload<string, T>,
  ) => Ref<WidgetPayload<string, T>['default']>;
  settle: (execute?: () => void) => void;
};

export function createStatehub() {
  return new Promise<StatehubExposed>((resolve) => {
    const element = document.createElement('div');
    element.id = 'statehub';
    document.body.appendChild(element);
    const app = createApp(Statehub);
    app.provide(IK_PREPARE, (exposed) => {
      resolve(exposed);
    });
    app.mount(element);
  });
}
