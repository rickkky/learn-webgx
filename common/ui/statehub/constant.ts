import type { InjectionKey } from 'vue';
import { StatehubExposed } from './index';
import ActionRecorder from './actioner.vue';
import Checkbox from './checkbox.vue';
import Slider from './slider.vue';

export const IK_PREPARE: InjectionKey<(exposed: StatehubExposed) => void> =
  Symbol('prepare');

export const WIDGET_MAP = {
  slider: Slider,
  checkbox: Checkbox,
  actioner: ActionRecorder,
};
