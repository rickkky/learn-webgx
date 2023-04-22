import type { InjectionKey } from 'vue';
import { UiExposed } from './index';
import ActionRecorder from './action-recorder.vue';
import Checkbox from './checkbox.vue';

export const IK_PREPARE: InjectionKey<(exposed: UiExposed) => void> =
  Symbol('prepare');

export const CONTROL_MAP = {
  'action-recorder': ActionRecorder,
  checkbox: Checkbox,
};
