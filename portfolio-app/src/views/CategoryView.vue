<script setup lang="ts">
import { selectorDeselect } from '@/stores/spaceStore'
import { useProjectStore } from '@/stores/projectStore'
import DraggableWindow from '@/components/DraggableWindow.vue'
import { useDevice, MediaQuery } from '@/composables/UseMediaQueries'

import { LocalTranslator } from '@/composables/UseLocalTranslator'
import type { CategoryData } from '@/types/objectData'
import FullscreenableImage from '@/components/elements/FullscreenableImage.vue'
import TagComponent from '@/components/elements/TagComponent.vue'

const props = defineProps<{
  data: CategoryData
}>()

const t = (key: string) => LocalTranslator.getLT(key)
const device = useDevice()
</script>

<template>
  <DraggableWindow
    class="w-2/3 max-h-[80vh] h-[600px] window flickAtStart"
    :class="{ sm: device.size < MediaQuery.sm, md: device.size < MediaQuery.md }"
    :onClose="
      () => {
        selectorDeselect()
        useProjectStore().selectProject()
      }
    "
    :id="props.data.slug || ''"
    :display-name="props.data.name"
    :center-at-start="device.size > MediaQuery.sm"
    :dockable="device.size > MediaQuery.sm"
    fullscreenOnMobile
    fullscreenable
    :dissmissable="device.size > MediaQuery.sm"
    :fixed="device.size < MediaQuery.sm"
  >
    <template v-slot:title>
      <h2 class="doto-text text-xl text-white text-center content-center max-h-[20vh]">
        {{ props.data.name }}
      </h2>
    </template>
    <div class="view p-4">
      <h3 class="title mb-2">{{ t('description') }}</h3>
      <p class="" v-html="props.data.description" />
      <h3 class="title mt-5 mb-2">{{ t('inthissystem') }}</h3>
      <div class="mt-2" v-for="(project, index) in props.data.projects" :key="index">
        <h2 class="title-2 inline">{{ project.name }}</h2>
        <span class="funnel-text"> - {{ project.date }}</span>
        <div v-if="project.tags" class="h-5 mb-2 inline-block ml-4">
          <TagComponent
            class="mr-1"
            v-for="(tag, index) in project.tags"
            :key="index"
            :toShow="tag"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-8 md:gap-4 items-center border-t-2">
          <div class="col-span-2">
            <FullscreenableImage
              v-if="project.thumbnails?.length"
              :src="'project_images/' + project.ressourcespath + project.thumbnails![0]"
              alt=""
            />
          </div>
          <div class="col-span-4">
            <p v-html="project.description"></p>
          </div>
          <div v-if="project.pages" class="col-span-2 mb-7 md:mb-0 mt-4 md:mt-0">
            <h2 class="title-2">{{ t('additionalcontent') }}</h2>
            <p
              v-for="page in project.pages"
              :key="page.slug"
              class="border w-max p-1 rounded-md mt-2"
            >
              {{ page.title }}
            </p>
          </div>
          <!--<button class="col-span-1 space-button mt-4 md:mt-0">{{ t('see') }}</button>-->
        </div>
      </div>
    </div>
  </DraggableWindow>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: flex-start;
}
.project-image {
  flex: 1;
  max-width: 300px;
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}
.tech-stack {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-top: 1rem;
}

.sm h2 {
  height: unset;
  max-height: unset;
}
.md .content {
  flex-direction: column;
  align-items: center;
}
</style>
