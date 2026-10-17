<script setup lang="ts">
import { systemsRef, p5Ready, selectedSystemRef } from '@/stores/spaceStore'
import { useDevice, MediaQuery } from '@/composables/UseMediaQueries'
import { useWindowZIndexStore } from '@/stores/draggableWindowsStore'
import draggableWindowDocker from '@/components/DraggableWindowDocker.vue'
import DraggableWindow from '@/components/DraggableWindow.vue'
import { LocalTranslator } from '@/composables/UseLocalTranslator'

const t = (key: string) => LocalTranslator.getLT(key)

const device = useDevice()
</script>

<template>
  <div>
    <div :class="{ mobile: device.size < MediaQuery.sm }" class="fixed bottom-10 right-20">
      <div v-if="device.size > MediaQuery.xs" class="frame-cutout cutout-right"></div>
      <div v-if="device.size > MediaQuery.xs" class="frame-cutout cutout-left"></div>

      <draggableWindowDocker
        v-if="device.size <= MediaQuery.xs"
        class="space-scrollbar draggableWindowDocker"
      ></draggableWindowDocker>
      <DraggableWindow
        v-if="!useWindowZIndexStore().isAnyWindowDocked || device.size > MediaQuery.xs"
        id="planetary-systems-menu"
        :display-name="t('projectsmenutitle')"
        class="planetary-systems-window"
        :class="{ 'planetary-systems-mobile': device.size < MediaQuery.sm }"
        :fixed="device.size < MediaQuery.sm"
        :resizable="device.size >= MediaQuery.sm"
      >
        <template #title>
          <h3 class="planetary-systems-title doto-text text-xl text-center content-center">
            {{ t('projectsmenutitle') }}
          </h3>
        </template>

        <div class="planetary-systems-content" v-if="p5Ready">
          <div class="menu-buttons space-scrollbar">
            <button
              v-for="(system, index) in systemsRef"
              :key="index"
              class="doto-text text-white w-full h-full glass-effect px-6 py-2"
              v-on:click="() => (selectedSystemRef = system)"
              :class="{
                selectedButton: system === selectedSystemRef,
              }"
              :data-text="system.name"
            >
              {{ system.name }}
            </button>
          </div>
        </div>
      </DraggableWindow>
    </div>
  </div>
</template>

<style scoped>
button:hover {
  box-shadow: 0px 0px 10px 3px rgba(255, 255, 255, 0.11);
}

.frame-cutout {
  background-color: white;
  width: 10px;
  position: absolute;
  top: 0;
  bottom: 0;
}
.cutout-left {
  background: url('/anvisgit/ui/frame_border_Left.svg') no-repeat center center;
  background-size: cover;
  right: -10px;
}
.cutout-right {
  background: url('/anvisgit/ui/frame_border_Right.svg') no-repeat center center;
  background-size: cover;
  left: -10px;
}
.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  height: 83.333333%;
  padding: 4px;
}

.mobile {
  display: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
}
.mobile .menu-buttons {
  flex-direction: row;
  overflow: auto;
  padding-bottom: 1rem;
}
.mobile .menu-buttons button {
  flex-shrink: 0;
  width: fit-content;
  height: auto;
}
.mobile h3 {
  font-size: 1rem /* 20px */;
  line-height: 1.5rem /* 28px */;
  margin-bottom: 1rem;
}
.mobile .draggableWindowDocker {
  height: 15vh;
  max-height: unset;
}
</style>
