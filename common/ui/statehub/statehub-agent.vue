<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import Statehub from './statehub.vue';
import { StatehubProps } from './type';

const props = defineProps<{
  prepare: (createStatehub: any) => void;
}>();

const propsList: StatehubProps[] = reactive([]);
const stateList: any[] = reactive([]);

function createStatehub<S>(props: StatehubProps) {
  const state: any = {};
  for (const payload of props.payloads) {
    state[payload.key] = payload.default;
  }
  const i = propsList.length;
  propsList.push(props);
  stateList.push(state);
  return {
    observe: (callback: (state: S) => void) => {
      watch(() => stateList[i], callback);
    },
    get state() {
      return stateList[i] as S;
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
      :state="stateList[i]"
      @update:state="stateList[i] = $event"
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
