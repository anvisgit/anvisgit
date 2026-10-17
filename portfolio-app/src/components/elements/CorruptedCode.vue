<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

const code = ref('')
const props = defineProps<{
  length: number
}>()

const codeText = `☰☲☱☴☵☶☳☷▊☉☼☽☾☿♀♂♁♃♄♅♆♇⚳⚴⚵⚶⚷⚸⚹⚺⚻⚼⚿⛀⛁⛂⛃⛆⛇⛈⛉⛊⛋⛌⛍⛏⛐⛑⛒⛓⛕⛖⛗⛘⛙⛚⛛⛜⛝⛞⛟`

let toShow = ''
const typingInterval = setInterval(() => {
  for (let i = 0; i < props.length; i++) {
    toShow += codeText.charAt(Math.floor(Math.random() * codeText.length))
  }
  code.value = toShow
  toShow = ''
}, 50)

onUnmounted(() => {
  clearInterval(typingInterval)
})
</script>

<template>
  <pre class="codeSample pointer-events-none doto-text" v-text="code"></pre>
</template>

<style scoped>
.codeSample {
  /*padding: 200px 200px 0px 100px;*/

  /*color: rgb(255, 255, 255) !important;*/
}
</style>
