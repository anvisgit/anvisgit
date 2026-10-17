<script setup lang="ts">
import { LocalTranslator } from '@/composables/UseLocalTranslator'
import type { ObjectData } from '@/types/objectData'
import TextWritter from '../elements/TextWritter.vue'

const props = defineProps<{
  data: ObjectData
}>()

const t = (s: string) => LocalTranslator.getLT(s, props.data.slug)
</script>

<template>
  <section class="p-5">
    <div class="project-description">
      <h2 class="title">{{ t('inShort') }}</h2>
      <TextWritter
        class="funnel-text"
        :datatext="t('inShortContent')"
        style="white-space: unset"
        :showCursor="true"
        :timedelay="500"
      ></TextWritter>

      <p class="note funnel-text italic">{{ t('note') }}</p>

      <h2 class="title">{{ t('keyTechniqueChoices') }}</h2>
      <p class="funnel-text" v-html="t('keyTechniqueChoicesContent')"></p>
      <div class="actions">
        <a href="/anvisgit/download/movie_collection_app.apk" download="movie_collection_app.apk">
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
strong {
  font-style: normal !important;
  font-weight: 700 !important;
}

.project-card {
  padding: 2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.project-image {
  flex: 1;
  max-width: 200px;
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
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

.tech-stack {
  display: flex;
  gap: 3rem;
  margin-top: 1rem;
}

.tech-stack h3 {
  margin-bottom: 0.25rem;
  font-weight: 900;
  font-size: 1.2rem;
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
