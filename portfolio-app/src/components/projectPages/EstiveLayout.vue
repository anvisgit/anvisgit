<script setup lang="ts">
import { path } from '@/composables/usePublicImagePath'
import FullscreenableImage from '../elements/FullscreenableImage.vue'

//Local translation
import { LocalTranslator } from '@/composables/UseLocalTranslator'
import { type ObjectData } from '@/types/objectData'

const props = defineProps<{
  data: ObjectData
}>()
const t = (key: string) => LocalTranslator.getLT(key, props.data.slug)
</script>

<template>
  <section class="p-5">
    <div class="project-description">
      <div class="flex xl:flex-row flex-col items-center w-full">
        <div class="mr-10 xl:w-1/2">
          <h2 class="title">{{ t('contexttitle') }}</h2>

          <p class="funnel-text" v-html="t('contextcontent')"></p>
        </div>
        <div class="m-auto col-span-1 mt-10 xl:my-auto xl:w-1/2">
          <iframe
            width="50%"
            height="315"
            src="https://www.youtube-nocookie.com/embed/3RXlBouHftk?si=INRulQwyhxT62803;controls=0"
            title="YouTube video player"
            frameborder="0"
            allow="encrypted-media; picture-in-picture; "
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          <span class="italic text-center mx-auto block justify-center">
            {{ t('estivetitle') }}
          </span>
        </div>
      </div>
      <h2 class="title">{{ t('role') }}</h2>

      <p v-html="t('rolecontent')"></p>

      <h2 class="title">{{ t('movement') }}</h2>

      <p v-html="t('movementcontent')"></p>

      <h2 class="title">{{ t('organisation') }}</h2>

      <div class="grid grid-cols-4 gap-4">
        <div class="col-span-3 justify-center my-auto">
          <p v-html="t('organisationcontent')"></p>
        </div>
        <div class="m-auto col-span-1">
          <FullscreenableImage
            class="h-auto my-0"
            :src="path() + 'leadsheet.png'"
            :alt="t('leadsheet')"
          />
          <span class="italic text-center mx-auto block justify-center">
            {{ t('leadsheet') }}
          </span>
          <FullscreenableImage class="h-auto my-0" :src="path() + 'gantt.png'" :alt="t('gantt')" />
          <span class="italic text-center mx-auto block justify-center"> {{ t('gantt') }} </span>
        </div>
      </div>

      <h2 class="title">{{ t('tooldev') }}</h2>

      <p v-html="t('tooldevcontent')"></p>

      <h3 class="title-2">{{ t('harmonytool') }}</h3>

      <p v-html="t('harmonytoolcontent')"></p>

      <h3 class="title-2">{{ t('sheettool') }}</h3>

      <p v-html="t('sheettoolcontent')"></p>
    </div>
  </section>
</template>

<style scoped>
b,
strong {
  font-weight: 900 !important;
}

h2:not:first-of-type,
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
iframe {
  aspect-ratio: 16 / 9;
  height: 100%;
  width: 100%;
}
</style>
