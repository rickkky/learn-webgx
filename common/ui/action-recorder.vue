<script lang="ts" setup>
const props = defineProps<{
  actions: string[];
  modelValue: string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();
</script>

<template>
  <div class="ui-action-recorder">
    <div class="ui-action-redorder__btn-list">
      <button
        v-for="action in props.actions"
        :key="action"
        class="ui-action-recorder__btn"
        @click="emit('update:modelValue', [...modelValue, action])"
      >
        {{ action }}
      </button>
      <button @click="emit('update:modelValue', [])">Reset</button>
    </div>
    <div class="ui-action-recorder__records">
      <div v-for="(record, i) in modelValue" :key="i">
        {{ record }}
      </div>
    </div>
  </div>
</template>

<style></style>
