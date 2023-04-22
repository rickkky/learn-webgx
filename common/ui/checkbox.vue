<script lang="ts" setup>
const props = defineProps<{
  label: string;
  modelValue: boolean;
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
