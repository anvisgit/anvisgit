<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useWindowZIndexStore } from '@/stores/draggableWindowsStore'
import { useDevice, MediaQuery } from '@/composables/UseMediaQueries'
const device = useDevice()

const props = defineProps<{
  id: string
  displayName?: string
  docked?: boolean
  dockable?: boolean
  dissmissable?: boolean
  fullscreenable?: boolean
  fixed?: boolean
  onClose?: () => void
  initX?: number
  initY?: number
  centerAtStart?: boolean
  fullscreenOnMobile?: boolean
  fullscreen?: boolean
}>()

const windowStore = useWindowZIndexStore()

let lastX: string = '0px'
let lastY: string = '0px'

//Tell if the window should be shown in full screen, depend of mobile, forced fullscreen or toggle fullscreen
const isInFullscreen = ref<boolean>(false)

//Toogle for fullscreen on window's commands
const fullscreenToggle = ref<boolean>(false)

watch(fullscreenToggle, () => {
  if (fullscreenToggle.value && toDrag.value) {
    lastX = toDrag.value.style.left
    lastY = toDrag.value.style.top
    toDrag.value.style.left = '0px'
    toDrag.value.style.top = '0px'
  } else if (toDrag.value) {
    toDrag.value.style.left = lastX
    toDrag.value.style.top = lastY
  }
  isInFullscreen.value =
    props.fullscreen ||
    (props.fullscreenOnMobile && device.size < MediaQuery.sm) ||
    fullscreenToggle.value
})

const toDrag = ref(<HTMLElement | null>null)
const handle = ref(<HTMLElement | null>null)
let containerRect: DOMRect
let offsetX = 0
let offsetY = 0

const minify = ref<boolean>(false)

let precedentID = ''

//If the window changes it's ID, so should in the store
watch(
  () => props.displayName && props.id,
  () => {
    windowStore.unregister(precedentID)
    windowStore.register(props.id, props.displayName ? props.displayName : '', props.docked)
    precedentID = props.id
    minify.value = false
  },
)

const drag = (e: MouseEvent | TouchEvent) => {
  if (!props.fixed && !isInFullscreen.value) {
    if (toDrag.value == null || handle.value == null) return

    const handleRect = handle.value.getBoundingClientRect()
    const windowRect = toDrag.value.getBoundingClientRect()

    const clientX =
      e instanceof TouchEvent ? (e.touches[0]?.clientX ?? 0) : (e as MouseEvent).clientX
    const clientY =
      e instanceof TouchEvent ? (e.touches[0]?.clientY ?? 0) : (e as MouseEvent).clientY

    // Calculer l'offset entre la position du curseur et la position de la fenêtre
    offsetX = clientX - windowRect.left
    offsetY = clientY - windowRect.top

    containerRect = handleRect
    document.addEventListener('mousemove', dragOn)
    document.addEventListener('mouseup', dragOff)
    document.addEventListener('touchmove', dragOn)
    document.addEventListener('touchend', dragOff)
  }
}

const dragOn = (e: MouseEvent | TouchEvent) => {
  const toucheXY: { x: number; y: number } = { x: 0, y: 0 }
  toucheXY.x = e instanceof TouchEvent ? (e.touches[0]?.clientX ?? 0) : (e as MouseEvent).clientX
  toucheXY.y = e instanceof TouchEvent ? (e.touches[0]?.clientY ?? 0) : (e as MouseEvent).clientY

  if (toDrag.value != null) {
    const newLeft = toucheXY.x - offsetX
    const newTop = toucheXY.y - offsetY

    toDrag.value.style.left = `${newLeft}px`
    toDrag.value.style.top = `${newTop}px`
    toDrag.value.style.bottom = `unset`
    toDrag.value.style.transform = `unset`

    if (handle.value!.getBoundingClientRect().x + containerRect.width > window.innerWidth) {
      toDrag.value.style.left = `${window.innerWidth - containerRect.width - 0}px`
    }
    if (handle.value!.getBoundingClientRect().x < 0) {
      toDrag.value.style.left = `0px`
    }
    if (
      handle.value!.getBoundingClientRect().y + toDrag.value!.getBoundingClientRect().height >
      window.innerHeight
    ) {
      toDrag.value.style.top = `${window.innerHeight - toDrag.value!.getBoundingClientRect().height - 0}px`
    }
    if (handle.value!.getBoundingClientRect().y < 0) {
      toDrag.value.style.top = `0px`
    }
  }
}

function correctPosition() {
  setTimeout(() => {
    if (toDrag.value != null && handle.value != null) {
      const handleRect = handle.value.getBoundingClientRect()
      const windowRect = toDrag.value.getBoundingClientRect()

      if (handleRect.x + handleRect.width > window.innerWidth) {
        toDrag.value.style.left = `${window.innerWidth - handleRect.width}px`
      } else if (handleRect.x < 0) {
        toDrag.value.style.left = `0px`
      } else if (handleRect.y + windowRect.height > window.innerHeight) {
        toDrag.value.style.top = `${window.innerHeight - windowRect.height}px`
      } else if (handleRect.y < 0) {
        toDrag.value.style.top = `0px`
      }
    }
  }, 100)
}

const dragOff = () => {
  if (!props.fixed) {
    document.removeEventListener('mousemove', dragOn)
    document.removeEventListener('mouseup', dragOff)
    document.removeEventListener('touchmove', dragOn)
    document.removeEventListener('touchend', dragOff)
  }
}

onMounted(() => {
  windowStore.register(props.id, props.displayName ? props.displayName : '', props.docked)
  precedentID = props.id

  if (toDrag.value != null) {
    if (props.centerAtStart && !isInFullscreen.value) {
      if (toDrag.value) {
        toDrag.value.style.transform = `translate(-50%, -50%)`
        toDrag.value.style.transform = `translate(-50%, -50%)`
        toDrag.value.style.top = `50%`
        toDrag.value.style.left = `50%`
      }
    } else {
      if (!isInFullscreen.value) {
        if (props.initX) {
          toDrag.value.style.left = `${props.initX}px`
        }
        if (props.initY) {
          toDrag.value.style.top = `${props.initY}px`
        }
      }
    }
  }

  correctPosition()
  focus()
})

onBeforeUnmount(() => {
  // Nettoyer les listeners de drag
  if (!props.fixed) {
    document.removeEventListener('mousemove', dragOn)
    document.removeEventListener('mouseup', dragOff)
    document.removeEventListener('touchmove', dragOn)
    document.removeEventListener('touchend', dragOff)
  }
  windowStore.unregister(props.id)
})

const zIndex = computed(() => {
  return windowStore.windows[props.id]?.zIndex ?? 1
})

function focus() {
  windowStore.bringToFront(props.id)
}
</script>

<template>
  <div
    class="draggable-window glass-effect flex flex-col"
    :class="{
      docked: useWindowZIndexStore().windows[props.id]?.docked,
      mobile: (device.size < MediaQuery.sm && props.fullscreenOnMobile) || props.fullscreen,
      minifiedwindow: minify,
      fullscreen: isInFullscreen,
    }"
    ref="toDrag"
    @touchstart="
      (e) => {
        focus()
      }
    "
    @mousedown="
      (e) => {
        focus()
      }
    "
    :style="{ zIndex: zIndex }"
  >
    <div
      class="Header h-[10%]"
      ref="handle"
      @touchstart="
        (e) => {
          drag(e)
        }
      "
      @mousedown="
        (e) => {
          drag(e)
        }
      "
    >
      <div class="Header-title"><slot name="title" /></div>
      <div class="">
        <div class="flex flex-row items-center">
          <button
            class="Header-action"
            @click="
              () => {
                minify = !minify
                correctPosition()
              }
            "
            v-if="dissmissable && false"
          >
            {{ minify ? 'Show' : 'Hide' }}
          </button>
          <button
            class="Header-action"
            v-if="dockable"
            @click="
              () => {
                useWindowZIndexStore().toggleDocked(props.id)
              }
            "
          >
            <span v-if="device.size > MediaQuery.sm">━</span>
            <span v-else>✕</span>
          </button>
          <button
            class="Header-action"
            @click="
              () => {
                fullscreenToggle = !fullscreenToggle
                correctPosition()
              }
            "
            v-if="fullscreenable"
          >
            {{ fullscreenToggle ? '🗗' : '▢' }}
          </button>
          <button
            v-if="props.onClose"
            class="Header-action"
            @click="
              () => {
                if (props.onClose) props.onClose()
              }
            "
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    <div v-if="!minify" class="box flex-1 min-h-0 overflow-y-auto space-scrollbar">
      <slot></slot>
    </div>
    <div v-if="$slots.footer && !minify" class="shrink-0">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.Header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-header-background);
  padding: 0.5rem 1rem;
  cursor: move;
  user-select: none;
  border-bottom: 2px solid;
  border-color: white;
}

.draggable-window {
  position: absolute;
  color: white;
  box-shadow: 0.3em 0.3em 1em rgba(0, 0, 0, 0.8);
}

.minifiedwindow {
  height: min-content !important;
}

.box {
  min-width: 300px;
  min-height: 200px;
  transition: all 1s ease;
}

.Header-action {
  margin: 0 0.4rem;
}

.docked {
  display: none;
}

.mobile {
  width: 100%;
  height: 100dvh;
  max-height: unset;
  background-color: black;
}

.fullscreen {
  width: 100%;
  height: 100dvh;
  max-height: unset !important;
  max-width: unset !important;
  top: 0 !important;
  left: 0 !important;
  background-color: black;
  transform: translate(0, 0) !important;
}
</style>
