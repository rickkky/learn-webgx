<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';

const props = defineProps<{
  modelValue: number;
  max: number;
  min: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const railRef = ref<HTMLElement | null>(null);
const fillRef = ref<HTMLElement | null>(null);
const blockRef = ref<HTMLElement | null>(null);

onMounted(() => {
  updateFillAndBlock();
});

function updateFillAndBlock() {
  if (!railRef.value || !fillRef.value || !blockRef.value) return;
  const railWidth = railRef.value.clientWidth;
  const fillWidth = valueToRatio(props.modelValue) * railWidth;
  const blockWidth = blockRef.value.clientWidth;
  const offset = fillWidth - blockWidth / 2;
  fillRef.value.style.width = `${fillWidth}px`;
  blockRef.value.style.left = `${offset}px`;
}

let isDragging = false;
let startX = 0;
let startOffset = 0;

function handleRailMouseDown(e: MouseEvent) {
  const railWidth = railRef.value!.clientWidth;
  const ratio = e.offsetX / railWidth;
  const value = ratioToValue(ratio);
  emit('update:modelValue', value);
  nextTick(() => {
    updateFillAndBlock();
    handleBlockMouseDown(e);
  });
}

function handleBlockMouseDown(e: MouseEvent) {
  isDragging = true;
  startX = e.clientX;
  startOffset = blockRef.value!.offsetLeft;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging) {
    return;
  }
  const railWidth = railRef.value!.clientWidth;
  const delta = e.clientX - startX;
  const ratio = Math.min(Math.max((startOffset + delta) / railWidth, 0), 1);
  const value = ratioToValue(ratio);
  emit('update:modelValue', value);
  updateFillAndBlock();
}

function handleMouseUp() {
  isDragging = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}

function valueToRatio(value: number) {
  return (value - props.min) / (props.max - props.min);
}

function ratioToValue(ratio: number) {
  return ratio * (props.max - props.min) + props.min;
}
</script>

<template>
  <div class="ui-slider">
    <div class="ui-slider__rail-wrap">
      <div
        ref="railRef"
        class="ui-slider__rail"
        @mousedown="handleRailMouseDown"
      ></div>
      <div ref="fillRef" class="ui-slider__fill"></div>
      <div
        ref="blockRef"
        class="ui-slider__block"
        @mousedown="handleBlockMouseDown"
      ></div>
    </div>
    <span class="ui-slider__value">
      {{ props.modelValue.toFixed(1) }}
    </span>
  </div>
</template>

<style lang="scss">
.ui-slider {
  display: flex;
  align-items: center;
  user-select: none;
}
.ui-slider__rail-wrap {
  position: relative;
  flex: auto;
  height: 4px;
  margin-left: 6px;
  margin-right: 16px;
}
.ui-slider__rail {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 100%;
  width: 100%;
  border-radius: 2px;
  background-color: #e0e0e0;
  cursor: pointer;
}
.ui-slider__fill {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  height: 100%;
  border-radius: 2px;
  background-color: #007aff;
  pointer-events: none;
}
.ui-slider__block {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 3;
  box-sizing: content-box;
  width: 12px;
  height: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 50%;
  transform: translateY(-50%);
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3),
    inset 0 0 1px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
}
.ui-slider__value {
  width: 56px;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
