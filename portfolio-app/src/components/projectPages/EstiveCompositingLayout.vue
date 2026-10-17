<script setup lang="ts">
import { path } from '@/composables/usePublicImagePath'
import VideoCompare from '../elements/VideoCompare.vue'

//Local translation
import { LocalTranslator } from '@/composables/UseLocalTranslator'
import { type ObjectData } from '@/types/objectData'
import FullscreenWrapper from '../elements/FullscreenWrapper.vue'
import FullscreenableImage from '../elements/FullscreenableImage.vue'

const props = defineProps<{
  data: ObjectData
}>()
const t = (key: string) => LocalTranslator.getLT(key, props.data.slug, 'compositing')
</script>

<template>
  <section class="p-5">
    <div class="project-description">
      <div class="flex flex-row items-center">
        <div class="mr-10">
          <h2 class="title">{{ t('contexttitle') }}</h2>

          <p class="funnel-text mt-2" v-html="t('contextcontent')"></p>
        </div>
        <div class="m-auto col-span-1"></div>
      </div>

      <FullscreenWrapper>
        <VideoCompare
          :left-src="path() + 'AUT_CP_SC006_V01_NOCOMP.mp4'"
          :right-src="path() + 'AUT_CP_SC006_V01_COMP.mp4'"
        />
      </FullscreenWrapper>
      <FullscreenableImage :src="path() + 'Estive_SC006_3D.png'" />
      <FullscreenWrapper>
        <VideoCompare
          :left-src="path() + 'AUT_CP_032_NOCOMP.mp4'"
          :right-src="path() + 'AUT_CP_032_COMP.mp4'"
        />
      </FullscreenWrapper>

      <FullscreenWrapper>
        <VideoCompare
          :left-src="path() + 'AUT_CP_SC003_V01_NOCOMP.mp4'"
          :right-src="path() + 'AUT_CP_SC003_V01_COMP.mp4'"
        />
      </FullscreenWrapper>
      <FullscreenWrapper>
        <VideoCompare
          :left-src="path() + 'AUT_CP_SC014_V01_NOCOMP.mp4'"
          :right-src="path() + 'AUT_CP_SC014_V01_COMP.mp4'"
        />
      </FullscreenWrapper>
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
