import type { InjectionKey } from 'vue';
import { UiExposed } from './index';
import ActionRecorder from './action-recorder.vue';
import Checkbox from './checkbox.vue';
import Slider from './slider.vue';

export const IK_PREPARE: InjectionKey<(exposed: UiExposed) => void> =
  Symbol('prepare');

export const CONTROL_MAP = {
  slider: Slider,
  checkbox: Checkbox,
  'action-recorder': ActionRecorder,
};
