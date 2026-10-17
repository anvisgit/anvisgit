<script setup lang="ts">
import DraggableWindow from '@/components/DraggableWindow.vue'
import { showCookiesPopup } from '@/stores/globalStore'
import { LocalTranslator } from '@/composables/UseLocalTranslator'

const t = (key: string) => LocalTranslator.getLT(key)
</script>

<template>
  <DraggableWindow
    id="cookies"
    v-if="showCookiesPopup"
    center-at-start
    class="min-w-24 window flickAtStart fixed max-w-lg bg-black"
    :fullscreen="false"
    :onClose="
      () => {
        showCookiesPopup = false
      }
    "
  >
    <template v-slot:title>
      <h2 class="doto-text text-xl text-white text-center content-center max-h-[20vh]">Cookies</h2>
    </template>
    <div class="view p-4 doto-text">
      <p class="font-black text-gray-400">
        {{ t('cookiesexplain') }}
      </p>
      <p class="mt-4 font-black text-gray-400">
        {{ t('cookieshelpask') }}
      </p>
    </div>
  </DraggableWindow>
</template>
