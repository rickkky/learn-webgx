<script setup lang="ts" generic="S">
import { WIDGET_MAP } from './constant';
import { WidgetMapKeys, WidgetPayload } from './type';

defineProps<{
  name: string;
  state: S;
  payloads: WidgetPayload<string, WidgetMapKeys>[];
}>();

const emit = defineEmits<{
  (e: 'update:state', value: S): void;
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
        :modelValue="(state as any)[payload.key]"
        @update:modelValue="
          emit('update:state', {
            ...(state as any),
            [payload.key]: $event,
          })
        "
      />
    </div>
  </div>
</template>
