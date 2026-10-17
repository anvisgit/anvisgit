import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import p5 from 'p5'

export let hasFocus = false

export function useP5Canvas(container: Ref<HTMLElement | null>, sketchFn: (p: p5) => void) {
  let instance: p5 | null = null
  let canvas = undefined
  let canvasInteractionLayer: Element | null = null
  const updateCanvasFocus = (event: PointerEvent) => {
    hasFocus = event.target === canvasInteractionLayer
  }

  onMounted(() => {
    if (!container.value) return
    instance = new p5(sketchFn, container.value)

    setTimeout(() => {
      canvas = document.getElementById('mainCanvas')
      canvas?.addEventListener('webglcontextlost', retrieveContext)
    }, 1000)

    window.addEventListener('resize', onResize)
    canvasInteractionLayer = document.querySelector('.planet-interaction-layer')
    window.addEventListener('pointerover', updateCanvasFocus)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointerover', updateCanvasFocus)
    canvasInteractionLayer = null
    hasFocus = false
    instance?.remove()
    instance = null
  })

  const onResize = () => {
    instance?.resizeCanvas(window.innerWidth, window.innerHeight)
  }

  const retrieveContext = () => {
    console.warn('WebGL LOST - Recreating Skecth')
    instance?.remove()
    if (!container.value) return
    instance = new p5(sketchFn, container.value)
  }

  return { instance }
}
