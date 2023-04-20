<script lang="ts" setup>
import { reactive, watch, inject } from 'vue';
import { executorKey } from './key';
import ActionRecorder from './action-recorder.vue';

const CONTROL_MAP = {
  'action-recorder': ActionRecorder,
};

type ControlMap = {
  [key in keyof typeof CONTROL_MAP]: typeof CONTROL_MAP[key];
};

interface Payload<K extends string, T extends keyof ControlMap> {
  key: K;
  type: T;
  props: Omit<InstanceType<ControlMap[T]>['$props'], 'modelValue'>;
  default: InstanceType<ControlMap[T]>['$props']['modelValue'];
}

type PayloadList = Payload<string, keyof ControlMap>[];

type PayloadMap<T extends PayloadList> = {
  [key in T[number]['key']]: T[number]['default'];
};

const props = defineProps<{
  payloads: PayloadList;
}>();

const executor = inject(executorKey);

const data = reactive<PayloadMap<typeof props.payloads>>(
  props.payloads.reduce((acc, cur) => {
    acc[cur.key] = cur.default;
    return acc;
  }, {} as PayloadMap<typeof props.payloads>),
);

watch(
  data,
  (newData) => {
    if (executor) {
      executor(newData);
    }
  },
  { immediate: true },
);

defineExpose({
  data,
});
</script>

<template>
  <div class="ui-container">
    <component
      v-for="payload in props.payloads"
      :is="CONTROL_MAP[payload.type]"
      :key="payload.key"
      v-bind="payload.props"
      v-model="data[payload.key]"
    ></component>
  </div>
</template>

<script lang="scss"></script>
