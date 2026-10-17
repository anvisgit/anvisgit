<script setup lang="ts">
const props = defineProps<{
  color?: string | undefined
  secondarycolor?: string | undefined
}>()
</script>

<template>
  <div class="w-full h-full relative glass-effect glass-glow">
    <div
      class="glass-glow-element"
      :style="{
        borderImage:
          'linear-gradient(145deg, ' +
          props.color +
          'ff, ' +
          props.color +
          '1a, ' +
          props.secondarycolor +
          '1a, ' +
          props.secondarycolor +
          'ff) 1',
      }"
    ></div>
    <div
      class="glass-glow-element"
      :style="{
        borderImage:
          'linear-gradient(145deg, ' +
          props.color +
          'ff, ' +
          props.color +
          '1a, ' +
          props.secondarycolor +
          '1a, ' +
          props.secondarycolor +
          'ff) 1',
      }"
    ></div>
    <div
      class="glass-glow-element"
      :style="{
        background:
          'linear-gradient(145deg,' +
          props.color +
          '25, ' +
          props.color +
          '00, ' +
          props.secondarycolor +
          '00, ' +
          props.secondarycolor +
          '13)',
        borderImage:
          'linear-gradient(145deg, ' +
          props.color +
          'ff, ' +
          props.color +
          '1a, ' +
          props.secondarycolor +
          '1a, ' +
          props.secondarycolor +
          'ff) 1',
      }"
    ></div>
    <button
      class="doto-text text-white w-full h-full"
      :style="{
        background:
          'linear-gradient(145deg, ' +
          props.color +
          '25, ' +
          props.color +
          '00, ' +
          props.secondarycolor +
          '00, ' +
          props.secondarycolor +
          '13)',
        borderImage:
          'linear-gradient(145deg, ' +
          props.color +
          'ff, ' +
          props.color +
          '1a, ' +
          props.secondarycolor +
          '1a, ' +
          props.secondarycolor +
          'ff) 1',
      }"
    >
      <slot></slot>
    </button>
  </div>
</template>

<style scoped></style>
