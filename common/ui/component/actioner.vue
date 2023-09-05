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
  <div class="ui-actioner">
    <div class="ui-actioner__btn-list">
      <button @click="emit('update:modelValue', [])">Clear</button>
      <button
        v-for="action in props.actions"
        :key="action"
        class="ui-actioner__btn"
        @click="emit('update:modelValue', [...modelValue, action])"
      >
        {{ `${action.charAt(0).toUpperCase()}${action.slice(0)}` }}
      </button>
    </div>
    <div class="ui-actioner__records">
      <div v-for="(record, i) in modelValue" :key="i">
        {{ record }}
      </div>
    </div>
  </div>
</template>
