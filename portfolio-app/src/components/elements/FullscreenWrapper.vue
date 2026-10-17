<script setup lang="ts">
import { h, createApp, useSlots, cloneVNode } from 'vue'

const slots = useSlots()

function openFullscreen() {
  const fullscreenDiv = document.createElement('div')

  Object.assign(fullscreenDiv.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '99999',
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })

  document.body.appendChild(fullscreenDiv)

  const vnode = slots.default?.()[0]

  const FullscreenApp = {
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
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
          [
            vnode
              ? cloneVNode(vnode, {
                  style: {
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    margin: 'auto',
                  },
                })
              : null,

            h(
              'button',
              {
                onClick: close,
                style: {
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '2rem',
                  color: '#fff',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  borderRadius: '999px',
                  width: '2.5rem',
                  height: '2.5rem',
                },
              },
              '✕',
            ),
          ],
        )
    },
  }

  const app = createApp(FullscreenApp)
  app.mount(fullscreenDiv)
}
</script>

<template>
  <div class="inline-block relative">
    <slot />
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
