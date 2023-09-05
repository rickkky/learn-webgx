<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  name: string;
  options: {
    label: string;
    value: string;
  }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="statehub-radios">
    <label v-for="option of options">
      <input
        type="radio"
        :name="props.name"
        :value="option.value"
        :checked="option.value === modelValue"
        @change="
          emit('update:modelValue', ($event.target! as HTMLInputElement).value)
        "
      />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>
