<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  actions: string[];
}>();

const value = ref<string[]>([]);
</script>

<template>
  <div class="ui-action-recorder">
    <div class="ui-action-redorder__btn-list">
      <button
        v-for="action in props.actions"
        :key="action"
        class="ui-action-recorder__btn"
        @click="value.push(action)"
      >
        {{ action }}
      </button>
      <button @click="value = []">Reset</button>
    </div>
  </div>
</template>

<style></style>
