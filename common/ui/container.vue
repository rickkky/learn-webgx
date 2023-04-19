<script lang="ts" setup>
import { ref } from 'vue';

interface ControlValueMap {
  'action-recorder': string[];
}

interface Payload<K extends string, T extends keyof ControlValueMap> {
  key: K;
  type: T;
  default: ControlValueMap[T];
}

type PayloadList = Payload<string, keyof ControlValueMap>[];

type PayloadMap<T extends PayloadList> = {
  [K in T[number]['key']]: T[number]['default'];
};

interface ContainerProps {
  payloads: PayloadList;
}

const props = defineProps<ContainerProps>();

const data = ref<PayloadMap<typeof props.payloads>>(
  props.payloads.reduce((acc, cur) => {
    acc[cur.key] = cur.default;
    return acc;
  }, {} as PayloadMap<typeof props.payloads>),
);
</script>

<template>
  <div class="ui-container">
    <component v-for="payload in props.payloads" :is="payload.type"></component>
  </div>
</template>
