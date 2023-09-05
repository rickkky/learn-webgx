<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import Statehub from './statehub.vue';
import { StatehubProps } from './type';

const props = defineProps<{
  prepare: (createStatehub: any) => void;
}>();

const propsList: StatehubProps[] = reactive([]);
const statesList: any[] = reactive([]);

function createStatehub<S>(props: StatehubProps) {
  const states: any = {};
  for (const payload of props.payloads) {
    states[payload.key] = payload.default;
  }
  const i = propsList.length;
  propsList.push(props);
  statesList.push(states);
  return {
    observe: (callback: (states: S) => void) => {
      watch(() => statesList[i], callback);
    },
    get states() {
      return statesList[i] as S;
    },
  };
}

onMounted(() => {
  props.prepare(createStatehub);
});
</script>

<template>
  <div class="ui-statehub-agent">
    <Statehub
      v-for="(props, i) of propsList"
      :key="i"
      v-bind="props"
      :states="statesList[i]"
      @update:states="statesList[i] = $event"
    />
  </div>
</template>

<style lang="scss">
.ui-statehub-agent {
  box-sizing: border-box;
  padding: 8px;
  border-radius: 8px;
  background-color: #ffffff;
}
</style>
