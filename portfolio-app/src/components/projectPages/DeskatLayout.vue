<script setup lang="ts">
import TextWritter from '@/components/elements/TextWritter.vue'
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
      <h2 class="title">{{ t('experimentalgameplay') }}</h2>

      <TextWritter
        class="funnel-text"
        :datatext="t('description')"
        style="white-space: unset"
        :showCursor="true"
        :timedelay="500"
      ></TextWritter>

      <h2 class="title">{{ t('physicsdriven') }}</h2>

      <div class="grid grid-cols-4 gap-4">
        <div class="col-span-3 justify-center my-auto">
          <p class="funnel-text" v-html="t('physicsdrivencontent')"></p>
          <p class="funnel-text col-span-1" v-html="t('physicsdrivencontent2')"></p>
        </div>
        <div class="m-auto col-span-1">
          <FullscreenableImage
            class="h-auto my-0"
            :src="path() + 'behavior_tree.jpg'"
            alt="Behavior tree"
          />
          <span class="italic text-center mx-auto block justify-center">
            {{ t('behaviortree') }}
          </span>
          <FullscreenableImage
            class="h-auto my-0"
            :src="path() + 'editor.jpg'"
            alt="Behavior tree"
          />
          <span class="italic text-center mx-auto block justify-center"> {{ t('editor') }} </span>
        </div>
      </div>

      <h2 class="title">{{ t('whatilearned') }}</h2>

      <p v-html="t('whatilearnedcontent')"></p>
    </div>
  </section>
</template>

<style scoped>
b,
strong {
  font-weight: 900 !important;
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
