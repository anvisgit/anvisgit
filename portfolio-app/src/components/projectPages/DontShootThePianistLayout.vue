<script setup lang="ts">
import { path } from '@/composables/usePublicImagePath'

//Local translation
import { LocalTranslator } from '@/composables/UseLocalTranslator'
import { type ObjectData } from '@/types/objectData'
import VideoCompare from '../elements/VideoCompare.vue'
import FullscreenWrapper from '../elements/FullscreenWrapper.vue'

const props = defineProps<{
  data: ObjectData
}>()
const t = (key: string) => LocalTranslator.getLT(key, props.data.slug)
</script>

<template>
  <section class="p-5">
    <div class="project-description">
      <div class="grid grid-cols-2 items-start">
        <div class="mr-10 flex-grow">
          <h2 class="title">{{ t('contexttitle') }}</h2>
          <p class="funnel-text" v-html="t('contextcontent')"></p>
        </div>
        <div class="w-full">
          <h2 class="title">{{ t('role') }}</h2>
          <p v-html="t('rolecontent')"></p>
        </div>
      </div>
      <h2 class="title">{{ t('title') }}</h2>
      <FullscreenWrapper>
        <VideoCompare
          :left-src="path() + 'dontshootthepianist.mp4'"
          :right-src="path() + 'Storyboarddontshootthepianist.mp4'"
        >
        </VideoCompare>
      </FullscreenWrapper>
      <span class="italic text-center mx-auto block justify-center">
        {{ t('title') }}
      </span>
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
