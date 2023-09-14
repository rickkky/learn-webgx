<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  options: { label: string; value: string }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="ui-select">
    <select
      :value="props.modelValue"
      @change="
        emit('update:modelValue', ($event.target! as HTMLSelectElement).value)
      "
    >
      <option
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
