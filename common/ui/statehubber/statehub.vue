<script setup lang="ts">
import { ref, type Ref, reactive, watch, inject } from 'vue';
import { IK_PREPARE, WIDGET_MAP } from './constant';
import type { WidgetMap, WidgetPayload, WidgetPayloadList } from './index';

type PayloadValueMap<T extends WidgetPayloadList> = {
  [key in T[number]['label']]: Ref<T[number]['default']>;
};

const payloads = ref<WidgetPayloadList>([]);
const state = reactive<PayloadValueMap<WidgetPayloadList>>({});

const setup = <K extends string, T extends keyof WidgetMap>(
  payload: WidgetPayload<K, T>,
) => {
  const valueRef = ref<InstanceType<WidgetMap[T]>['$props']['modelValue']>(
    payload.default,
  );
  state[payload.label] = valueRef;
  payloads.value.push(payload);
  return valueRef;
};

const executor = ref<() => void>();

const settle = (execute?: () => void) => {
  executor.value = execute;
};

watch(
  [state, executor],
  () => {
    if (executor.value) {
      executor.value();
    }
  },
  { immediate: true },
);

const prepare = inject(IK_PREPARE, () => {});
prepare({ setup, settle });
</script>

<template>
  <div class="statehub-container">
    <div
      v-for="(payload, index) in payloads"
      :key="index"
      class="statehub-container__item"
    >
      <label>{{ payload.label }}</label>
      <component
        :is="(WIDGET_MAP[payload.type] as any)"
        v-bind="payload.props"
        v-model="state[payload.label]"
      ></component>
    </div>
  </div>
</template>

<style lang="scss">
.statehub-container__item {
  margin-bottom: 8px;
  label {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
  }
}
</style>
