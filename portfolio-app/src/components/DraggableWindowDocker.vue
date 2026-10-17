<script setup lang="ts">
import { computed } from 'vue'
import { useWindowZIndexStore } from '@/stores/draggableWindowsStore'

const windowStore = useWindowZIndexStore()

const dockedWindows = computed(() => {
  return Object.entries(windowStore.windows)
    .filter(([, w]) => w.docked)
    .map(([id, w]) => ({ id, ...w }))
})

const restoreWindow = (windowId: string) => {
  windowStore.toggleDocked(windowId)
  windowStore.bringToFront(windowId)
}
</script>

<template>
  <div
    class="window-dock glass-effect overflow-auto space-scrollbar"
    v-if="dockedWindows.length > 0"
  >
    <!--<h3 class="doto-text text-lg text-white text-center block border-b-2 w-full pb-[30px]">
      [ Docker ]
    </h3>-->
    <button
      v-for="window in dockedWindows"
      :key="window.id"
      @click="restoreWindow(window.id)"
      class="dock-button"
      :title="window.name"
    >
      {{ window.name }}
    </button>
  </div>
</template>

<style scoped>
.window-dock {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  z-index: 9999;
  padding: 10px 0px;
  /*border-color: white;
  background-color: black;
  border-width: 2px;*/
}

.dock-button {
  flex: 0 0 auto;
  background: rgb(0, 0, 0);
  border: 2px solid white;
  color: white;
  padding: 5px 5px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  margin: 5px 5px;
}

.dock-button:hover {
  background: rgba(255, 255, 255);
  color: black;
  transform: scale(1.05);
}
</style>
