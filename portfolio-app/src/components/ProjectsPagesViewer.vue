<script setup lang="ts">
import DraggableWindow from '@/components/DraggableWindow.vue'
import { type ProjectData } from '@/types/objectData'
import resolveProjectComponent from '@/composables/useProjectLayoutResolver'

const props = defineProps<{
  data: ProjectData
  fullscreen?: boolean
}>()

const winX = window.innerWidth
const winY = window.innerHeight
</script>

<template>
  <div v-if="props.data.pages">
    <DraggableWindow
      v-for="(value, index) in props.data.pages"
      v-bind:key="value.slug"
      :id="value.slug"
      :initX="winX / 3 + index * (winX / 10 / props.data.pages.length)"
      :initY="100 + index * ((winY / 2 - 200) / props.data.pages.length)"
      :display-name="value.title"
      docked
      dockable
      fullscreenable
      :fullscreen="fullscreen"
      fullscreenOnMobile
      class="w-3/6 max-h-[70vh] flickAtStart bg-black bg-opacity-80"
    >
      <template v-slot:title>
        <h2 class="doto-text text-xl text-white text-center content-center h-1/6">
          [ {{ value.title }} ]
        </h2>
      </template>
      <div class="overflow-y-auto space-scrollbar">
        <component
          v-if="
            value.content &&
            value.content[0] == '@' &&
            resolveProjectComponent(value.content.slice(1))
          "
          :is="resolveProjectComponent(value.content.slice(1))"
          :data="props.data"
          :pageindex="index"
        ></component>
        <span v-else v-html="value.content" class="funnel-text text-white flickAtStart-2"></span>
      </div>
    </DraggableWindow>
  </div>
</template>

<style scoped></style>
