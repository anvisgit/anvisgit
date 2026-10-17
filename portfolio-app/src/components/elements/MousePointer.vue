<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import type { ProjectData, CategoryData } from '@/types/objectData'

const mouseX = ref(0)
const mouseY = ref(0)

const props = defineProps<{
  label: string | null | undefined

  data?: ProjectData | CategoryData
}>()

onMounted(() => {
  window.addEventListener('mousemove', updatePosition)
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', updatePosition)
})

function updatePosition(e: MouseEvent) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}
</script>

<template>
  <div
    class="planet-hover-card fixed pointer-events-none glass-effect"
    ref="mousePointer"
    :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
  >
    <div class="planet-hover-card__content">
      <h2 class="planet-hover-card__title">
        {{
          props.data?.name
            ? '[ ' + props.data?.name + ' ]'
            : props.label
              ? '[ ' + props.label + ' ]'
              : 'x:' + mouseX + ' y:' + mouseY
        }}
      </h2>
      <img
        class="mt-3 max-h-52"
        :src="'project_images/' + props.data.ressourcespath + props.data.thumbnails[0]"
        v-if="props.data?.type === 'ProjectData' && props.data.thumbnails?.length"
      />
      <div class="planet-hover-card__chips" v-if="props.data?.type === 'ProjectData' && props.data.tags?.length">
        <span v-for="(tag, index) in props.data.tags" :key="index">{{ tag }}</span>
      </div>
      <div
        class="planet-hover-card__description"
        v-if="props.data?.description"
        v-html="props.data.description"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.planet-hover-card {
  z-index: 10000;
  width: min(330px, calc(100vw - 24px));
  padding: 14px 16px;
  border: 1px solid rgba(68, 255, 0, 0.62);
  border-radius: 4px;
  background: rgba(2, 12, 8, 0.96);
  box-shadow: 0 0 22px rgba(68, 255, 0, 0.2);
  transform: translate(18px, -50%);
}
.planet-hover-card__title { margin: 0; color: #44ff00; font: 700 12px/1.5 'Doto', monospace; letter-spacing: .08em; text-transform: uppercase; }
.planet-hover-card__chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.planet-hover-card__chips span { padding: 3px 6px; border: 1px solid rgba(0, 229, 255, .45); color: #00e5ff; font: 600 10px/1.3 'Funnel Display', sans-serif; }
.planet-hover-card__description { margin-top: 8px; color: #d5f5c8; font: 400 12px/1.55 'Funnel Display', sans-serif; }
</style>
