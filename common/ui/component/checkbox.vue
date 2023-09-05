<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  label: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<template>
  <div class="ui-checkbox">
    <input
      type="checkbox"
      :checked="props.modelValue"
      @change="
        emit('update:modelValue', ($event.target! as HTMLInputElement).checked)
      "
    />
    <label>{{ props.label }}</label>
  </div>
</template>
