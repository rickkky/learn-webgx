<script lang="ts" setup>
import { ref, type Ref, reactive, watch, inject } from 'vue';
import { IK_PREPARE, CONTROL_MAP } from './constant';
import type { ControlMap, ControlPayload, ControlPayloadLIst } from './index';

type PayloadValueMap<T extends ControlPayloadLIst> = {
  [key in T[number]['key']]: Ref<T[number]['default']>;
};

const data = reactive<PayloadValueMap<ControlPayloadLIst>>({});

const payloads = ref<ControlPayloadLIst>([]);
const setup = <K extends string, T extends keyof ControlMap>(
  payload: ControlPayload<K, T>,
) => {
  const value = ref<InstanceType<ControlMap[T]>['$props']['modelValue']>(
    payload.default,
  );
  data[payload.key] = value;
  payloads.value.push(payload);
  return value;
};

const handleData = ref<() => void>();
const settle = (execute?: () => void) => {
  handleData.value = execute;
};
watch(
  data,
  () => {
    if (handleData.value) {
      handleData.value();
    }
  },
  { immediate: true },
);

const prepare = inject(IK_PREPARE, () => {});
prepare({
  setup,
  settle,
});
</script>

<template>
  <div class="ui-container">
    <component
      v-for="payload in payloads"
      :is="CONTROL_MAP[payload.type]"
      :key="payload.key"
      v-bind="payload.props"
      v-model="data[payload.key]"
    ></component>
  </div>
</template>

<script lang="scss"></script>
