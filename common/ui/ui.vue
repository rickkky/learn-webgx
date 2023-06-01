<script lang="ts" setup>
import { ref, type Ref, reactive, watch, inject } from 'vue';
import { IK_PREPARE, CONTROL_MAP } from './constant';
import type { ControlMap, ControlPayload, ControlPayloadList } from './index';

type PayloadValueMap<T extends ControlPayloadList> = {
  [key in T[number]['label']]: Ref<T[number]['default']>;
};

const data = reactive<PayloadValueMap<ControlPayloadList>>({});

const payloads = ref<ControlPayloadList>([]);
const setup = <K extends string, T extends keyof ControlMap>(
  payload: ControlPayload<K, T>,
) => {
  const value = ref<InstanceType<ControlMap[T]>['$props']['modelValue']>(
    payload.default,
  );
  data[payload.label] = value;
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
    <div
      v-for="(payload, index) in payloads"
      :key="index"
      class="ui-container__item"
    >
      <label>{{ payload.label }}</label>
      <component
        :is="(CONTROL_MAP[payload.type] as any)"
        v-bind="payload.props"
        v-model="data[payload.label]"
      ></component>
    </div>
  </div>
</template>

<style lang="scss">
.ui-container__item {
  margin-bottom: 8px;
  label {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
  }
}
</style>
