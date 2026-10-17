<script setup lang="ts">
import { ref } from 'vue'
import FullscreenableImage from '@/components/elements/FullscreenableImage.vue'

const props = defineProps<{
  images: string[]
  path: string
}>()

const currentIndex = ref(0)

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const previousSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

const isVertical = ref(false)

const onImgLoad = (e: Event) => {
  const img = e.target as HTMLImageElement
  isVertical.value = img.naturalHeight > img.naturalWidth
}
</script>

<template>
  <div class="carousel-container">
    <button @click="previousSlide" class="carousel-button prev">❮</button>

    <div class="carousel-slide">
      <FullscreenableImage
        :src="'project_images/' + path + images[currentIndex]"
        :alt="`Slide ${currentIndex + 1}`"
        @load="onImgLoad"
        :class="isVertical ? 'vertical' : 'horizontal'"
      />
    </div>

    <button @click="nextSlide" class="carousel-button next">❯</button>

    <div class="carousel-dots">
      <span
        v-for="(_, index) in images"
        :key="index"
        :class="{ active: index === currentIndex }"
        @click="currentIndex = index"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.carousel-slide {
  width: 100%;
  max-width: 800px;
}

.carousel-slide img.horizontal {
  width: 100%;
  height: auto;
  max-width: 900px;
  border-radius: 8px;
  cursor: pointer;
}

.carousel-slide img.vertical {
  width: auto;
  height: 100%;
  max-height: 800px;
  border-radius: 8px;
  cursor: pointer;
  margin: auto;
}

.carousel-button {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.5rem;
}

.carousel-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

.carousel-dots {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}

.carousel-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: background 0.3s;
}

.carousel-dots span.active {
  background: rgba(255, 255, 255, 0.8);
}
</style>
