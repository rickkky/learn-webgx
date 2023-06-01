import { type Ref, createApp } from 'vue';
import Ui from './ui.vue';
import { CONTROL_MAP, IK_PREPARE } from './constant';

export type ControlMap = {
  [key in keyof typeof CONTROL_MAP]: (typeof CONTROL_MAP)[key];
};

export interface ControlPayload<K extends string, T extends keyof ControlMap> {
  label: K;
  type: T;
  props: Omit<InstanceType<ControlMap[T]>['$props'], 'modelValue'>;
  default: InstanceType<ControlMap[T]>['$props']['modelValue'];
}

export type ControlPayloadList = ControlPayload<string, keyof ControlMap>[];

export type UiExposed = {
  setup: <T extends keyof ControlMap>(
    payload: ControlPayload<string, T>,
  ) => Ref<ControlPayload<string, T>['default']>;
  settle: (execute?: () => void) => void;
};

export function createUi() {
  return new Promise<UiExposed>((resolve) => {
    const element = document.createElement('div');
    element.id = 'ui';
    document.body.appendChild(element);
    const app = createApp(Ui);
    app.provide(IK_PREPARE, (exposed) => {
      resolve(exposed);
    });
    app.mount(element);
  });
}
