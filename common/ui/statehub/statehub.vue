<script setup lang="ts" generic="S">
import { WIDGET_MAP } from './constant';
import { WidgetMapKeys, WidgetPayload } from './type';

defineProps<{
  name: string;
  states: S;
  payloads: WidgetPayload<string, WidgetMapKeys>[];
}>();

const emit = defineEmits<{
  (e: 'update:states', value: S): void;
}>();
</script>

<template>
  <div class="ui-stateform">
    <div class="ui-stateform__title">{{ name }}</div>
    <div
      v-for="payload of payloads"
      :key="payload.key"
      class="ui-stateform__item"
    >
      <label class="ui-stateform__item-label">{{ payload.label }}</label>
      <component
        :is="(WIDGET_MAP[payload.type] as any)"
        v-bind="payload.props"
        :modelValue="(states as any)[payload.key]"
        @update:modelValue="
          emit('update:states', {
            ...(states as any),
            [payload.key]: $event,
          })
        "
      />
    </div>
  </div>
</template>
