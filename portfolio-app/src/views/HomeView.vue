<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, watchEffect } from 'vue'
import { sketch } from '@/assets/space/sketch.js'
import FakeCode from '@/components/elements/FakeCode.vue'
import DraggableWindow from '@/components/DraggableWindow.vue'
import TextWritter from '@/components/elements/TextWritter.vue'
import mousePointer from '@/components/elements/MousePointer.vue'
import { selector, resetStore } from '@/stores/spaceStore'
import { useProjectStore } from '@/stores/projectStore'
 
import { LocalTranslator } from '@/composables/UseLocalTranslator'
import { useRandomToggle } from '@/composables/UseRandomToggle'
import DraggableImageGallery from '@/components/DraggableImageGallery.vue'
import { useP5Canvas } from '@/composables/UseP5Canvas'
import { useDevice, MediaQuery } from '@/composables/UseMediaQueries'
import ImageCarousel from '@/components/elements/ImageCarousel.vue'
import { useWindowZIndexStore } from '@/stores/draggableWindowsStore'
import draggableWindowDocker from '@/components/DraggableWindowDocker.vue'
import ContactDetails from '@/components/ContactDetails.vue'
import ProjectView from '@/views/ProjectView.vue'
import NavMenu from '@/components/NavMenu.vue'
import ProjectsPagesViewer from '@/components/ProjectsPagesViewer.vue'
import PerformancePanel from '../components/PerformancePanel.vue'
import CategoryView from './CategoryView.vue'
import CookiesPopup from '../components/CookiesPopup.vue'

const githubLink = 'https://github.com/anvisgit/anvisgit'
const publicBaseUrl = import.meta.env.BASE_URL
const device = useDevice()
const projectStore = useProjectStore()

//Visual glitch toggle for the call to action button
const isActiveGlitch = useRandomToggle(500, 4000)
const isNameGlitch = ref(false)
let nameGlitchInterval: number | undefined
let nameGlitchResetTimeout: number | undefined

//Component toggles
const showContactDetails = ref(false)

//Infos to display on mouse pointer
const mouseTag = ref('')

const canvasContainer = ref<HTMLDivElement | null>(null)
useP5Canvas(canvasContainer, sketch)

onMounted(() => {
  useP5Canvas(canvasContainer, sketch)
  nameGlitchInterval = window.setInterval(() => {
    isNameGlitch.value = true
    nameGlitchResetTimeout = window.setTimeout(() => {
      isNameGlitch.value = false
      nameGlitchResetTimeout = undefined
    }, 1500)
  }, 120_000)
})

//Reset the visual selectr of the 3D view if route as changed
watchEffect(() => {
  const route = projectStore.resolveProjectFromQuery()
  if (route === undefined) {
    selector.selectedObject = null
  }
})

//Reset spaceStore
onBeforeUnmount(() => {
  if (nameGlitchInterval !== undefined) window.clearInterval(nameGlitchInterval)
  if (nameGlitchResetTimeout !== undefined) window.clearTimeout(nameGlitchResetTimeout)
  resetStore()
})
</script>

<template>
  <main
    id="portfolio-root"
    class="relative z-0 overflow-hidden h-full"
    :class="{ mobile: device.size < MediaQuery.sm }"
  >
    <div class="fixed block h-full w-full pointer-events-none left-0 right-0 top-0">
      <div class="grid-render w-full h-full fixed -z-10 flickAtStart-2"></div>
      <div class="grid-better w-full h-full fixed -z-10 flickAtStart-2"></div>
      <div class="grid-hide w-full h-full fixed -z-10 flickAtStart-2"></div>

      <div>
        <div ref="canvasContainer" class="flickAtStart-2"></div>
      </div>
      <div class="grid-compose w-full h-full fixed -z-10 flickAtStart-2"></div>
    </div>

    <div class="grid grid-cols-12 grid-rows-12 fixed left-0 top-0 w-full h-full">
      <div class="fixed top-20 right-20" v-if="device.size > MediaQuery.sm">
        <PerformancePanel> </PerformancePanel>
        <TextWritter
          datatext="C://SYSTEMS_FILES/IO/</br>/PORTFOLIO.EXE</br>///QUALITY PROFILED</br>--OPTIMIZED REDERING--"
          :showCursor="true"
          :timedelay="1"
          :speed="50"
          class="text-left text-white font-bold text-sm mb-2 mx-auto"
        ></TextWritter>
      </div>

      <NavMenu />

      <div class="fixed bottom-16 left-16 flex justify-center" v-if="device.size > MediaQuery.sm">
        <button
          class="contact-button min-w-[150px] min-h-[50px] text-lg doto-text uppercase"
          :class="{ calltoaction: isActiveGlitch }"
          @click="showContactDetails = true"
        >
          LET’S GET IN TOUCH
        </button>
        <a
          :href="githubLink"
          target="_blank"
          @mouseover="mouseTag = LocalTranslator.getLT('showcode')"
          @mouseleave="mouseTag = ''"
          class="space-button min-h-[50px] text-lg doto-text uppercase ml-5 p-2 flex items-center justify-center"
        >
          <!--&lt;/&gt;-->
          <img :src="`${publicBaseUrl}tags/github.svg`" alt="GitHub" class="w-7" />
        </a>
      </div>

      <FakeCode
        v-if="device.size > MediaQuery.sm"
        class="z-2 pointer-events-none p-10 col-start-1 col-end-4 row-start-8 row-end-12"
        :nbOfLines="7"
        :speed="15"
      ></FakeCode>

       
    </div>
    <div class="fixed top-0 left-0 bg-black w-2/6 h-1/4 blur-3xl"></div>
    <div
      class="flex flex-col pl-[5%] pt-[5vh] z-3 absolute"
      :class="{ mobiletitleblock: device.size < MediaQuery.sm }"
    >
      <h1
        class="title m-auto md:m-0 w-max md:w-max"
        :class="{ glitch: isNameGlitch, mobile: device.size < MediaQuery.sm }"
        data-text="Anvi Wadhwa"
        ref="name"
      >
        Anvi Wadhwa
      </h1>
      <span
        class="doto-text md:text-xl text-white"
        :class="{ dotoglitch: isActiveGlitch }"
        :data-text="LocalTranslator.getLT('secondarytitle')"
        >{{ LocalTranslator.getLT('secondarytitle') }}</span
      >
    </div>

    <button
      class="contact-button fixed bottom-24 left-5 z-20 min-h-[46px] px-5 text-sm doto-text uppercase sm:hidden"
      @click="showContactDetails = true"
    >
      LET’S GET IN TOUCH
    </button>
    <CookiesPopup />
    <!-- Image draggable windows -->
    <DraggableImageGallery
      v-if="projectStore.selectedData && projectStore.selectedData.type === 'ProjectData'"
      :images="projectStore.selectedData.images || []"
      :path="projectStore.selectedData.ressourcespath || ''"
      class="flickAtStart draggable-image-gallery"
      dissmissable
    ></DraggableImageGallery>

    <DraggableWindow
      id="carousel"
      v-if="
        projectStore.selectedData?.type === 'ProjectData' &&
        projectStore.selectedData.carousel &&
        projectStore.selectedData.ressourcespath &&
        projectStore.selectedData.carousel.length > 0
      "
      :display-name="LocalTranslator.getLT('carouselview')"
      class="flickAtStart-3"
      docked
      :fixed="device.size < MediaQuery.sm"
      :dissmissable="device.size > MediaQuery.sm"
      dockable
      fullscreenOnMobile
      fullscreenable
    >
      <template v-slot:title
        ><h2 class="doto-text text-xl text-white text-center content-center h-1/6">
          [ {{ LocalTranslator.getLT('carouselview') }} ]
        </h2></template
      >
      <div class="p-5 w-full">
        <ImageCarousel
          :images="projectStore.selectedData.carousel"
          :path="projectStore.selectedData.ressourcespath"
        >
        </ImageCarousel>
      </div>
    </DraggableWindow>

    <ProjectView
      :data="projectStore.selectedData"
      v-if="projectStore.selectedData?.type === 'ProjectData'"
    ></ProjectView>
    <CategoryView
      :data="projectStore.selectedData"
      v-if="projectStore.selectedData?.type === 'CategoryData'"
    ></CategoryView>
    <ProjectsPagesViewer
      :data="projectStore.selectedData"
      v-if="projectStore.selectedData?.type === 'ProjectData'"
    />

    <!-- Contact details -->
    <ContactDetails
      v-if="showContactDetails"
      @close="showContactDetails = false"
    />

    <!-- Mouse pointer element -->
    <mousePointer
      style="z-index: 10000"
      v-if="device.size > MediaQuery.sm"
      :label="mouseTag != '' ? mouseTag : null"
      :data="projectStore.preselectedData"
    ></mousePointer>

    <!-- Bottom Framing Dynamic Pannel -->
    <div class="notification" v-if="device.size > MediaQuery.sm">
      <div class="cutout-bottom text-center">
         
      </div>
      <div
        class="notification-container"
        :class="{ show: useWindowZIndexStore().isAnyWindowDocked }"
      >
        <draggableWindowDocker class="space-scrollbar" />
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="selectors" v-if="device.size > MediaQuery.sm"></div>
    <!-- Framing around the canvas -->
    <div v-if="device.size > MediaQuery.sm" class="frame-cutout cutout-left"></div>
    <div v-if="device.size > MediaQuery.sm" class="frame-cutout cutout-right"></div>
    <div class="frame-cutout cutout-top"></div>
    <div class="w-full h-full absolute frame-box top-0 left-0"></div>
    <div class="cornerTL"></div>
    <div class="cornerTR"></div>
    <div class="cornerBL"></div>
    <div class="cornerBR"></div>
  </main>
</template>

<style scoped>
main {
  background-color: black;
  width: 100vw;
  height: 100dvh;
  display: block;
}
html,
body {
  height: 100%;
  overflow: hidden;
}
.mobile .fixed {
  position: absolute;
}
.title {
  color: white;
  font-size: 4rem;
  font-family: 'Orbitron', sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}
.mobile.title {
  font-size: 3rem;
}
.mobiletitleblock {
  padding-left: 0;
  text-align: center;
  width: 100%;
}

.full-svg {
  width: 100%;
  height: 100%;
}

.selectors {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
}
.selectors::before {
  width: 4vw;
  height: 4vw;
  top: 30px;
  right: 30px;
  content: '';
  position: absolute;
  border-top: white solid 2px;
  border-right: white solid 2px;
}
.selectors::after {
  width: 4vw;
  height: 4vw;
  bottom: 30px;
  left: 30px;
  content: '';
  position: absolute;
  border-bottom: white solid 2px;
  border-left: white solid 2px;
}

.grid-render {
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  transform: perspective(1000px) rotateX(45deg) translateZ(200px);
}

.grid-better {
  transform: perspective(1000px) rotateX(45deg) translateZ(200px);
  background-size: 40px 40px;
  background-image: radial-gradient(rgba(255, 255, 255, 0.055) 2px, transparent 0);
  background-position: -19.5px -19.5px;
}
.grid-hide {
  background-color: black;
  border-radius: 60%;
  width: 50%;
  height: 50%;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  filter: blur(100px);
}
.grid-compose {
  border-color: rgb(0, 0, 0);
  border-width: 200px;
  top: 0;
  left: 0;
  filter: blur(50px);
}

.s1 {
  fill: none;
  stroke: #ffffff;
  stroke-width: 3;
  stroke-miterlimit: 10;
  stroke-dasharray: 1500 500;
  animation: dash-rotate 40s linear infinite;
}

@keyframes dash-rotate {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -2000;
  }
}

@media (max-width: 640px) {
  .menu {
    width: 90%;
  }
}

.glow {
  box-shadow:
    0px 0px 10px 3px rgba(255, 255, 255, 0.35),
    inset 0px 0px 10px 3px rgba(255, 255, 255, 0.35);
}
button:hover {
  box-shadow: 0px 0px 10px 3px rgba(255, 255, 255, 0.11);
}

.inside-glow {
  box-shadow: inset 0px 0px 10px 3px rgba(255, 255, 255, 0.35);
}

.frame-box {
  border: 10px solid white;
  padding: 20px;
  pointer-events: none;
}
.frame-cutout {
  background-color: white;
  position: absolute;
}
.cutout-left {
  background: url('/anvisgit/ui/frame_border_Left.svg') no-repeat center center;
  top: 50%;
  left: 0;
  height: 40%;
  width: 30px;
  transform: translate(0, -50%);
}
.cutout-right {
  background: url('/anvisgit/ui/frame_border_Right.svg') no-repeat center center;
  top: 50%;
  right: 0;
  height: 40%;
  width: 30px;
  transform: translate(0, -50%);
}
.cutout-top {
  background: url('/anvisgit/ui/frame_border_Top.svg') no-repeat center center;
  top: 0%;
  left: 50%;
  height: 30px;
  width: 40%;
  transform: translate(-50%, 0);
}
.mobile .cutout-top {
  background: url('/anvisgit/ui/frame_border_Top.svg') no-repeat center center / 100% 40%;
}

.cutout-bottom {
  background: url('/anvisgit/ui/frame_border_Bottom.svg') no-repeat center center;
  background-size: contain;
  width: 40vw;
  align-self: center;
}
.notification {
  position: absolute;
  width: 40vw;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.notification-container {
  width: 100%;
  transition: all 0.5s 1s ease;
  max-height: 0;
  overflow: hidden;
}
.show {
  max-height: 500px; /* Hauteur maximale estimée du contenu */
  transition: all 2s ease;
}
.show:before {
  border-radius: 100px 100px 0px 0px;
  z-index: -1;
  left: -10%;
  bottom: -50%;
  position: absolute;
  display: block;
  content: '';
  width: 120%;
  height: 120%;
  background-color: #ffffffee;
  filter: blur(150px);
  opacity: 0;
  animation: flash 0.5s linear 1s 1;
}

@keyframes flash {
  0% {
    opacity: 0%;
  }
  50% {
    opacity: 100%;
  }
  100% {
    opacity: 0%;
  }
}

.cornerTL {
  background: url('/anvisgit/ui/corner_border_LT.svg') no-repeat center center;
  background-size: cover;
  top: 10px;
  left: 10px;
  height: 20px;
  width: 20px;
  position: absolute;
}
.cornerTR {
  background: url('/anvisgit/ui/corner_border_RT.svg') no-repeat center center;
  background-size: cover;
  top: 10px;
  right: 10px;
  height: 20px;
  width: 20px;
  position: absolute;
}
.cornerBL {
  background: url('/anvisgit/ui/corner_border_LB.svg') no-repeat center center;
  background-size: cover;
  bottom: 10px;
  left: 10px;
  height: 20px;
  width: 20px;
  position: absolute;
}
.cornerBR {
  background: url('/anvisgit/ui/corner_border_RB.svg') no-repeat center center;
  background-size: cover;
  bottom: 10px;
  right: 10px;
  height: 20px;
  width: 20px;
  position: absolute;
}

.calltoaction {
  animation: pulse 5s 0s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: skew(40deg);
  }
  1% {
    transform: skew(-15deg);
    opacity: 1;
  }
  2% {
    transform: skew(0deg);
    opacity: 0;
  }
  2.5% {
    opacity: 1;
  }
  3% {
    opacity: 0;
  }
  4% {
    opacity: 1;
  }

  6% {
    opacity: 0;
    transform: skew(0deg);
  }
  6.5% {
    opacity: 1;
    transform: skew(40deg);
  }
  7% {
    opacity: 0;
  }
  8.5% {
    opacity: 1;
    transform: skew(-20deg);
  }
  9% {
    transform: skew(0deg);
  }

  35.5% {
    opacity: 1;
  }
  36% {
    opacity: 0;
    transform: skew(0deg);
  }
  36.5% {
    opacity: 1;
    transform: skew(40deg);
  }
  37% {
    opacity: 0;
  }
  38.5% {
    opacity: 1;
    transform: skew(-20deg);
  }
  39% {
    transform: skew(0deg);
  }
}

.sci-fi {
  border-image: linear-gradient(90deg, #ffffff00 0%, #ffffff00 80%, #ffffffff 81%, #ffffffff 100%) 1;
}
</style>
