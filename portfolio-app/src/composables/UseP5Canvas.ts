import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import p5 from 'p5'

export let hasFocus = false

export function useP5Canvas(container: Ref<HTMLElement | null>, sketchFn: (p: p5) => void) {
  let instance: p5 | null = null
  let canvas = undefined

  onMounted(() => {
    if (!container.value) return
    instance = new p5(sketchFn, container.value)

    setTimeout(() => {
      canvas = document.getElementById('mainCanvas')
      canvas?.addEventListener('webglcontextlost', retrieveContext)
    }, 1000)

    window.addEventListener('resize', onResize)
    const canvasClick = document.querySelector(
      '#app > main > div.grid.grid-cols-12.grid-rows-12.fixed.left-0.top-0.w-full.h-full',
    )
    window.addEventListener('mouseover', (e) => {
      const element = e?.target as HTMLElement
      hasFocus = element == canvasClick
    })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    const canvasClick = document.querySelector(
      '#app > main > div.grid.grid-cols-12.grid-rows-12.fixed.left-0.top-0.w-full.h-full',
    )
    window.removeEventListener('mouseover', (e) => {
      const element = e?.target as HTMLElement
      hasFocus = element == canvasClick
    })
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
