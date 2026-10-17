<script setup lang="ts">
import DraggableWindow from '@/components/DraggableWindow.vue'
import FullscreenableImage from '@/components/elements/FullscreenableImage.vue'

const props = defineProps<{
  images: string[]
  path: string
  onClose?: () => void
}>()

const winX = window.innerWidth
const winY = window.innerHeight
</script>

<template>
  <div>
    <DraggableWindow
      v-for="(value, index) in props.images"
      v-bind:key="value"
      :id="value"
      :onClose="onClose"
      :initX="winX / 3 + index * (winX / 10 / props.images.length)"
      :initY="100 + index * ((winY / 2 - 200) / props.images.length)"
      :display-name="value.replaceAll('_', ' ').slice(0, value.indexOf('.'))"
      docked
      fullscreenable
      dockable
    >
      <template v-slot:title>
        <h2 class="doto-text text-xl text-white text-center content-center h-1/6">
          [ {{ value.replaceAll('_', ' ').slice(0, value.indexOf('.')) }} ]
        </h2>
      </template>
      <FullscreenableImage
        :src="'project_images/' + props.path + value"
        alt="Project Image"
        class="max-w-full max-h-96 mx-auto my-4"
      ></FullscreenableImage>
    </DraggableWindow>
  </div>
</template>

<style scoped></style>
