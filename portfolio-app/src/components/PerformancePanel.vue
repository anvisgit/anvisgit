<script setup lang="ts">
import PerformanceWatcher from '@/assets/space/PerformanceWatcher.ts'
</script>

<template>
  <div
    class="text-left relative text-white font-bold text-sm doto-text border border-gray-500 p-2 w-max mb-4 border-dashed"
    v-if="PerformanceWatcher.triggerUpdate.value || !PerformanceWatcher.triggerUpdate.value"
  >
    <div class="dot absolute -top-[2px] -right-[2px]"></div>
    <div class="dot absolute -top-[2px] -left-[2px]"></div>
    <div class="dot absolute -bottom-[2px] -right-[2px]"></div>
    <div class="dot absolute -bottom-[2px] -left-[2px]"></div>
    <!--<div
      v-if="Math.round(PerformanceWatcher.quality * 100) < 50"
      class="text-red-500 doto-text w-max mb-2 text-center mx-auto"
    >
      ⚠ Degraded quality
    </div>-->
    <div class="flex gap-2 gap">
      <div class="flex flex-col gap-2 items-center">
        <div class="doto-text">Quality</div>
        <div class="doto-text">Fps</div>
      </div>
      <div class="flex flex-col gap-2 h-30">
        <div class="w-20 border border-white h-full">
          <div
            class="h-full bg-white loadingbar"
            :style="`width : ${PerformanceWatcher.quality * 100}%`"
          ></div>
        </div>
        <div class="w-20 border border-white h-full relative">
          <div
            class="h-[140%] border-r-2 border-green-300 absolute -top-[20%] left-0"
            :style="`width : ${Math.round((PerformanceWatcher.maxThresholdFps / 30) * 100)}%`"
          ></div>
          <div
            class="h-[140%] border-r-2 border-red-300 absolute -top-[20%] left-0"
            :style="`width : ${Math.round((PerformanceWatcher.minThresholdFps / 30) * 100)}%`"
          ></div>
          <div
            class="h-full loadingbar absolute top-0 left-0"
            :style="`width : ${Math.round((PerformanceWatcher.frameRate / 30) * 100)}%`"
          ></div>
        </div>
      </div>
      <div class="flex flex-col gap-2 items-center">
        <div class="justify-self-center doto-text min-w-12">
          {{ Math.round(PerformanceWatcher.quality * 100) }}%
          <span
            v-if="Math.round(PerformanceWatcher.quality * 100) < 50"
            class="text-red-500 doto-text w-max text-center mx-auto blink"
          >
            ⚠
          </span>
        </div>
        <div class="justify-self-center doto-text min-w-12">
          {{ Math.floor(PerformanceWatcher.frameRate) }}
          <span
            v-if="
              Math.round(PerformanceWatcher.frameRate) <
              Math.round(PerformanceWatcher.minThresholdFps)
            "
            class="text-red-500 doto-text w-max text-center mx-auto blink"
          >
            ⚠
          </span>
        </div>
      </div>
    </div>

    <div
      class="text-white doto-text flex gap-2 mt-4 text-center mx-auto w-max"
      v-if="PerformanceWatcher.isUpdating"
    >
      <div
        v-if="PerformanceWatcher.frameRate < PerformanceWatcher.minThresholdFps"
        class="text-green-200 doto-text"
      >
        Optimizing
      </div>
      <div
        v-if="PerformanceWatcher.frameRate > PerformanceWatcher.maxThresholdFps"
        class="text-green-200 doto-text"
      >
        Boosting
      </div>
      <!-- by @aurer from codepen -->
      <div class="loader" title="4">
        <svg
          x="0px"
          y="0px"
          width="12px"
          height="15px"
          viewBox="0 0 24 30"
          style="enable-background: new 0 0 50 50"
          xml:space="preserve"
        >
          <rect x="0" y="0" width="4" height="10" fill="#fff">
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="translate"
              values="0 0; 0 20; 0 0"
              begin="0"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="10" y="0" width="4" height="10" fill="#fff">
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="translate"
              values="0 0; 0 20; 0 0"
              begin="0.2s"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="20" y="0" width="4" height="10" fill="#fff">
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="translate"
              values="0 0; 0 20; 0 0"
              begin="0.4s"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgb(255, 255, 255);
}

.loadingbar {
  background-color: #ffffff;
  opacity: 1;
  background: repeating-linear-gradient(45deg, #00000000, #00000000 2px, #ffffff 2px, #ffffff 5px);
}

.blink {
  animation: blink-animation 1s steps(10, start) infinite;
}
@keyframes blink-animation {
  50% {
    opacity: 0%;
  }
}
</style>
