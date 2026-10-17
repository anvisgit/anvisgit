<script setup lang="ts">
import { LocalTranslator } from '@/composables/UseLocalTranslator'
import FakeCode from '@/components/elements/FakeCode.vue'
import TextWritter from '@/components/elements/TextWritter.vue'

import { useDevice, MediaQuery } from '@/composables/UseMediaQueries'
const device = useDevice()

const textForLoader = [
  LocalTranslator.getLT('loadingtext_01'),
  LocalTranslator.getLT('loadingtext_02'),
  LocalTranslator.getLT('loadingtext_03'),
  /*LocalTranslator.getLT('loadingtext_04'),
  LocalTranslator.getLT('loadingtext_05'),*/
  LocalTranslator.getLT('loadingtext_06'),
  LocalTranslator.getLT('loadingtext_07'),
  LocalTranslator.getLT('loadingtext_08'),
]
</script>

<template>
  <div class="w-full h-full absolute bg-black"></div>

  <div class="fixed inset-0 bg-black endAnimation">
    <FakeCode
      class="pointer-events-none h-full absolute flickAtStart-3 p-10"
      id="fakeCode1"
      :nbOfLines="30"
    ></FakeCode>

    <FakeCode
      v-if="device.size > MediaQuery.md"
      class="pointer-events-none top-1/2 left-2/4 w-1/2 h-full absolute"
      :nbOfLines="10"
    ></FakeCode>

    <svg viewBox="0 0 1920 1080" preserveAspectRatio="none" class="flickAtStart w-full h-full">
      <g id="Layer 1">
        <rect
          id="Forme 4"
          x="26"
          y="24"
          width="1868"
          height="1031"
          fill="none"
          class="whiteStroke strokeAnimated03"
        />
      </g>
    </svg>

    <div class="flex w-full h-full absolute content-center items-center top-0">
      <div class="flex row-auto w-full justify-center">
        <svg
          id="circlesSVG"
          viewBox="0 0 650 650"
          width="650"
          height="650"
          class="flickAtStart-2 mx-4 self-center"
        >
          <g id="Layer 2">
            <circle id="Forme 3" class="whiteStroke strokeAnimated02" cx="325" cy="325" r="310" />
            <circle id="Forme 2" class="whiteStroke strokeAnimated01" cx="325" cy="325" r="324" />
          </g>
        </svg>
      </div>
    </div>
    <div
      class="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center"
    >
      <span
        style="min-width: 200px; max-width: 500px; width: max-content"
        class="text-left doto-text text-xl text-white content-center m-10"
      >
        <TextWritter
          class="pointer-events-non flickAtStart-2"
          :datatext="
            textForLoader.join(`
            `)
          "
          :showCursor="true"
          :timedelay="1000"
          :speed="20"
          :nb-of-lines="device.size > MediaQuery.xs ? 8 : 4"
        ></TextWritter>
      </span>
    </div>

    <!-- by @aurer from codepen -->
    <div class="loader" title="4">
      <svg
        x="0px"
        y="0px"
        width="24px"
        height="30px"
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
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.s0 {
  fill: #000000;
  stroke: #000000;
  stroke-miterlimit: 10;
}

.whiteStroke {
  fill: none;
  stroke: #ffffff;
  stroke-width: 3;
  stroke-miterlimit: 10;
  stroke-linejoin: miter;
  stroke-linecap: none;
  vector-effect: non-scaling-stroke;
}

.strokeAnimated01 {
  stroke-dasharray: 339.12, 339.12; /* 324*2*3.14 = 2034.72 -> /6 = 339.12 */
  animation: dash-rotate 6s linear infinite;
  transition: ease 250ms;
}
.strokeAnimated02 {
  stroke-dasharray: 500, 200;
  animation: dash-rotate-counter 60s linear infinite;
  transition: ease 250ms;
}
.strokeAnimated03 {
  stroke-dasharray: 2000, 400;
  animation: dash-rotate-counter 60s linear infinite;
  transition: ease 250ms;
}

@keyframes dash-rotate {
  to {
    stroke-dashoffset: -3052.08;
  }
}

@keyframes dash-rotate-counter {
  to {
    stroke-dashoffset: 20000;
  }
}

.endAnimation {
  animation: fadeOut 0.5s ease-in-out 7s forwards;
}
@keyframes fadeOut {
  0% {
    opacity: 0;
    visibility: hidden;
  }
  10% {
    opacity: 1;
    visibility: visible;
  }
  14% {
    opacity: 0;
    visibility: hidden;
  }
  25% {
    opacity: 1;
    visibility: visible;
  }
  50% {
    opacity: 0;
    visibility: hidden;
  }
  700% {
    opacity: 1;
    visibility: visible;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}

.loader {
  text-align: center;
  display: block;
  border-color: white;
  color: #ffffff;
  position: absolute;
  bottom: 5rem;
  right: 5rem;
}

@media (min-width: 640px) {
  #circlesSVG {
    max-width: 650px;
  }

  #fakeCode1 {
    padding: 6rem;
    max-width: 50%;
  }
}
</style>
