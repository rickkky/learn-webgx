<script setup lang="ts">
const props = defineProps<{
  modelValue: string[];
  actions: string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();
</script>

<template>
  <div class="statehub-actioner">
    <div class="statehub-action-redorder__btn-list">
      <button @click="emit('update:modelValue', [])">Clear</button>
      <button
        v-for="action in props.actions"
        :key="action"
        class="statehub-actioner__btn"
        @click="emit('update:modelValue', [...modelValue, action])"
      >
        {{ `${action.charAt(0).toUpperCase()}${action.slice(0)}` }}
      </button>
    </div>
    <div class="statehub-actioner__records">
      <div v-for="(record, i) in modelValue" :key="i">
        {{ record }}
      </div>
    </div>
  </div>
</template>

<style></style>
