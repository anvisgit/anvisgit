<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const code = ref('')
const props = defineProps<{
  datatext: string
  showCursor: boolean | null | undefined
  timedelay?: number
  nbOfLines?: number
  speed?: number
}>()

let codeText =
  props.datatext && props.datatext != '' ? props.datatext : `Nothing to show here... :(`
const nbOfLinesToShow = props.nbOfLines ?? 20
const speed = props.speed ?? 5

let cursorInterval: number
let typingInterval: number
let timeoutId: number

let lastTime = performance.now()

onBeforeUnmount(() => {
  clearInterval(typingInterval)
  clearInterval(cursorInterval)
  clearTimeout(timeoutId)
})

watch(
  () => [props.datatext, props.timedelay, props.showCursor],
  () => {
    if (!props.datatext || props.datatext == '') {
      code.value = `Nothing to show here... :(`
    } else {
      const timedelay = props.timedelay || 0
      clearTimeout(timeoutId)

      codeText = props.datatext || 'Nothing to show here... :('

      clearInterval(typingInterval)
      clearInterval(cursorInterval)

      timeoutId = setTimeout(() => {
        lastTime = performance.now()
        readText()
      }, timedelay)
    }
  },
  { immediate: true },
)

function readText() {
  let index = 0
  const toShow = ['']
  let codeValueBuffer = ''
  code.value = ''

  typingInterval = setInterval(() => {
    /*
    To handle the case where the code runs slower than speed expected,
    I calculate a delta time and skip characters if needed to catch up.
    This way, the animation will still finish in a reasonable time even if the machine is slow or the text is long.

    We compare to speed*2 as a tolerence to not skip to much
    */
    let charsToWrite = 1
    const now = performance.now()
    if (now - lastTime > speed * 2) {
      const charsToSkip = Math.floor((now - lastTime) / speed) - 1
      charsToWrite += charsToSkip
    }

    for (let i = 0; i < charsToWrite; i++) {
      if (index < codeText.length) {
        /* Check if we have exceeded the number of lines to show */
        if (codeText[index] === '\n') {
          toShow.push('')
          if (toShow.length > nbOfLinesToShow) {
            toShow.shift()
            codeValueBuffer = toShow.join('\n')
          }
          index++
          continue
        }

        // See if current char is start of a tag, so it skips the html tags
        if (codeText.charAt(index) === '<') {
          const tagEnd = codeText.indexOf('>', index)
          if (tagEnd === -1) {
            index++
          } else {
            toShow[toShow.length - 1] += codeText.substring(index, tagEnd + 1)
            index = tagEnd + 1
          }
        } else {
          toShow[toShow.length - 1] += codeText.charAt(index)
          index++
        }
      }
      //if we reached the end of the text, stop typing and start the blink
      else {
        code.value = codeValueBuffer
        startCursorBlink(toShow.join('\n'))
        clearInterval(typingInterval)
      }
    }
    codeValueBuffer = toShow.join('\n') + (props.showCursor ? '▮' : '')

    code.value = codeValueBuffer

    lastTime = performance.now()
  }, speed)
}

function startCursorBlink(textToShow: string) {
  if (!props.showCursor) return
  let showCursor = false

  clearInterval(cursorInterval)

  cursorInterval = setInterval(() => {
    code.value = textToShow + (showCursor ? '▮' : '<span style="color: transparent;">▮</span>')
    showCursor = !showCursor
  }, 500)
}
</script>

<template>
  <div class="codeSample pointer-events-none doto-text max-w-max text" v-html="code"></div>
</template>

<style scoped>
.codeSample {
  /*padding: 200px 200px 0px 100px;*/
  color: rgb(255, 255, 255) !important;
}
.text {
  white-space: pre-line;
}
</style>
