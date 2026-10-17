<script setup lang="ts">
import { path } from '@/composables/usePublicImagePath'

//Local translation
import { LocalTranslator } from '@/composables/UseLocalTranslator'
import { type ObjectData } from '@/types/objectData'
import FullscreenWrapper from '../elements/FullscreenWrapper.vue'
import FullscreenableImage from '../elements/FullscreenableImage.vue'

const props = defineProps<{
  data: ObjectData
}>()
const t = (key: string) => LocalTranslator.getLT(key, props.data.slug, 'technicalaspect')
</script>

<template>
  <section class="p-5 funnel-text">
    <div class="project-description">
      <div class="flex flex-row items-center">
        <div class="mr-10">
          <h2 class="title">{{ t('contexttitle') }}</h2>

          <p class="funnel-text mt-2" v-html="t('contextcontent')"></p>
        </div>
        <div class="m-auto col-span-1"></div>
      </div>
      <FullscreenWrapper>
        <video :src="path() + 'blender_demo.mp4'" autoplay loop></video>
      </FullscreenWrapper>
      <div class="grid grid-cols-3">
        <FullscreenableImage class="col-span-2" :src="path() + 'DSTP_06.jpg'" />
        <p class="col-span-1 pl-4 pt-4 block m-auto">
          {{ t('shader') }}
        </p>
      </div>
      <div class="grid grid-cols-2 gap-4 items-center">
        <FullscreenableImage :src="path() + 'DSTP_03.jpg'" />
        <FullscreenableImage :src="path() + 'DSTP_07.jpg'" />
      </div>
      <p class="">
        {{ t('details') }}
      </p>
      <div class="grid grid-cols-3 items-center">
        <div class="col-span-1 w-full">
          <FullscreenableImage :src="path() + 'DSTP_04.jpg'" />
          <i class="mx-auto w-max block">Scene avec personnages</i>
        </div>
        <p class="col-span-2 pl-4 pt-4 block m-auto" v-html="t('characterDetails')"></p>
      </div>
      <div class="grid grid-cols-2 gap-4 items-center">
        <FullscreenableImage :src="path() + 'DSTP_00.jpg'" />
        <FullscreenableImage :src="path() + 'DSTP_01.jpg'" />
      </div>
    </div>
  </section>
</template>

<style scoped>
b,
strong {
  font-weight: 900 !important;
}

h2,
h3 {
  margin-top: 1.5rem;
}

.project-card {
  padding: 2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.project-description {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-description p {
  line-height: 1.6;
  opacity: 0.9;
}

.note {
  font-size: 0.85rem;
  opacity: 0.6;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s ease;
  border: none;
}

.btn img {
  width: 24px;
  height: 24px;
}

.btn.primary {
  background: linear-gradient(135deg, #5f9cff, #7c4dff);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.08);
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

strong {
  font-weight: bolder;
}
</style>
