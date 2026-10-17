import { ref, onMounted, onUnmounted } from 'vue'

export function useRandomToggle(min = 500, max = 4000) {
  const state = ref(true)
  let timer: number | null = null

  const loop = () => {
    const delay = Math.random() * (max - min) + min
    timer = setTimeout(
      () => {
        state.value = !state.value
        loop()
      },
      state.value == true ? delay : delay * 2,
    )
  }

  onMounted(loop)

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return state
}
