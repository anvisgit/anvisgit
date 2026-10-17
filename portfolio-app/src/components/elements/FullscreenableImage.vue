<script setup lang="ts">
import { h, createApp } from 'vue'

defineOptions({ inheritAttrs: true })
const props = defineProps<{
  src?: string | undefined
  alt?: string
}>()

function openFullscreen() {
  // Crée une div root
  const fullscreenDiv = document.createElement('div')
  fullscreenDiv.style.position = 'fixed'
  fullscreenDiv.style.top = '0'
  fullscreenDiv.style.left = '0'
  fullscreenDiv.style.width = '100vw'
  fullscreenDiv.style.height = '100vh'
  fullscreenDiv.style.zIndex = '99999'
  fullscreenDiv.style.background = 'rgba(0,0,0,0.85)'
  fullscreenDiv.style.display = 'flex'
  fullscreenDiv.style.alignItems = 'center'
  fullscreenDiv.style.justifyContent = 'center'
  document.body.appendChild(fullscreenDiv)

  // Composant temporaire pour l'image fullscreen
  const FullscreenImg = {
    setup() {
      const close = () => {
        app.unmount()
        document.body.removeChild(fullscreenDiv)
      }
      return () =>
        h(
          'div',
          {
            style: {
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            onClick: close,
          },
          [
            h('img', {
              src: props.src,
              alt: props.alt,
              style: {
                maxWidth: '90vw',
                maxHeight: '90vh',
                boxShadow: '0 0 40px #000',
                borderRadius: '1em',
              },
            }),
            h(
              'button',
              {
                style: {
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '2rem',
                  color: '#fff',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '2em',
                  height: '2em',
                  cursor: 'pointer',
                },
                onClick: close,
              },
              '✕',
            ),
          ],
        )
    },
  }
  const app = createApp(FullscreenImg)
  app.mount(fullscreenDiv)
}
</script>

<template>
  <div class="relative">
    <img
      :src="props.src"
      :alt="props.alt"
      @click="openFullscreen"
      class="max-w-full max-h-96 my-4 mx-auto cursor-pointer"
    />
    <button class="absolute bottom-0 right-0 p-1" @click="openFullscreen">
      <div class="bg-black rounded-xl absolute bottom-8 p-2 right-8 blur-md"></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-fullscreen absolute bottom-8 right-8"
        viewBox="0 0 16 16"
      >
        <path
          d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.fullscreen {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  max-width: unset !important;
  max-height: unset !important;
}
</style>
