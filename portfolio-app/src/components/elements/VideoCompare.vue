<template>
  <div class="video-compare">
    <div class="wrapper" ref="container">
      <video
        ref="video1"
        class="video video-right"
        :src="props.rightSrc"
        muted
        playsinline
        loading="lazy"
      />

      <div class="video-overlay" :style="overlayStyle">
        <video
          ref="video2"
          class="video video-left"
          :src="props.leftSrc"
          muted
          playsinline
          loading="lazy"
        />
      </div>

      <button
        class="slider relative"
        :style="{ left: position + '%' }"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <div class="handleline"></div>
        <div class="handle"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  leftSrc: String,
  rightSrc: String,
})

const container = ref<HTMLElement | null>(null)
const video1 = ref<HTMLVideoElement | null>(null)
const video2 = ref<HTMLVideoElement | null>(null)

const position = ref(50)
let dragging = false

let syncInterval: number | null = null

const overlayStyle = computed(() => ({
  width: position.value + '%',
}))

const syncVideos = () => {
  if (!video1.value || !video2.value) return

  const diff = video2.value.currentTime - video1.value.currentTime

  if (Math.abs(diff) > 0.05) {
    video2.value.currentTime = video1.value.currentTime
  }
}

const playBoth = () => {
  video1.value?.play()
  video2.value?.play()
}

const onEnded = () => {
  if (video1.value?.ended && video2.value?.ended) {
    playBoth()
  }
}

const startDrag = () => {
  dragging = true
}

const stopDrag = () => {
  dragging = false
}

const onMove = (e: MouseEvent | TouchEvent) => {
  if (!dragging) return

  const rect = container.value?.getBoundingClientRect()
  const clientX = e instanceof TouchEvent ? e.touches[0]?.clientX : e.clientX

  if (!rect || !clientX) return
  let percent = ((clientX - rect.left) / rect.width) * 100
  percent = Math.max(0, Math.min(100, percent))

  position.value = percent
}

onMounted(() => {
  playBoth()

  syncInterval = window.setTimeout(syncVideos, 500)

  window.addEventListener('mousemove', onMove)
  window.addEventListener('touchmove', onMove)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchend', stopDrag)
  video1.value?.addEventListener('ended', onEnded)
  video2.value?.addEventListener('ended', onEnded)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchend', stopDrag)
  window.clearTimeout(syncInterval!)
  video1.value?.removeEventListener('ended', onEnded)
  video2.value?.removeEventListener('ended', onEnded)
})
</script>

<style scoped>
.video-compare {
  overflow: hidden;
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper {
  max-height: 90vh;
  position: relative;
  align-self: center;
  width: auto;
  aspect-ratio: 16 / 9; /* important pour garder une hauteur stable */
}

.handle {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url('/anvisgit/ui/handle.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  filter: drop-shadow(0px 0px 3px #00000083);
}

.video {
  top: 0;
  left: 0;
  height: 100%;
  object-fit: cover; /* évite déformation */
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.video-left {
  height: 100%;
  width: auto;
  object-position: left;
}

.slider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30px;
  cursor: ew-resize;
  transform: translateX(-50%);
  z-index: 10;
}
.slider .handleline {
  width: 2px;
  height: 100%;
  background: white;
  margin: 0 auto;
  filter: drop-shadow(0px 0px 3px #00000083);
  -webkit-mask-image: radial-gradient(circle at center, transparent 20px, black 20px);
  mask-image: radial-gradient(circle at center, transparent 20px, black 20px);
}

video {
  pointer-events: none;
}
</style>
