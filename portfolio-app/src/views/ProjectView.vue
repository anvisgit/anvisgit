<script setup lang="ts">
import { selectorDeselect } from '@/stores/spaceStore'
import { useProjectStore } from '@/stores/projectStore'
import DraggableWindow from '@/components/DraggableWindow.vue'
import FullscreenableImage from '@/components/elements/FullscreenableImage.vue'
import StackComponent from '@/components/StackComponent.vue'
import { useDevice, MediaQuery } from '@/composables/UseMediaQueries'
import ProjectEndLink from '../components/elements/ProjectEndLink.vue'
import DraggableWindowDocker from '@/components/DraggableWindowDocker.vue'

import resolveProjectComponent from '@/composables/useProjectLayoutResolver'

//path to public images
import { path } from '@/composables/usePublicImagePath'
import { LocalTranslator } from '@/composables/UseLocalTranslator'
import { type ProjectData } from '@/types/objectData'

const props = defineProps<{
  data: ProjectData
  fullscreen?: boolean
}>()

const t = (key: string) => LocalTranslator.getLT(key)
const device = useDevice()
</script>

<template>
  <DraggableWindow
    class="w-2/3 max-h-[80vh] h-[600px] window flickAtStart"
    :class="[
      { sm: device.size < MediaQuery.sm, md: device.size < MediaQuery.md },
      `project-window project-window-${data.slug}`,
    ]"
    :onClose="
      () => {
        useProjectStore().selectProject()
        selectorDeselect()
      }
    "
    :id="data.slug"
    :display-name="props.data.name"
    :center-at-start="device.size > MediaQuery.sm"
    :dockable="device.size > MediaQuery.sm"
    fullscreenOnMobile
    fullscreenable
    :fullscreen="props.fullscreen"
    :dissmissable="device.size > MediaQuery.sm && false"
    :fixed="device.size < MediaQuery.sm"
  >
    <template v-slot:title>
      <h2 class="doto-text text-xl text-white text-center content-center max-h-[20vh]">
        {{ props.data.name }}
      </h2>
    </template>
    <div class="view">
      <div class="content p-5">
        <div
          v-if="
            (props.data.techstack && props.data.techstack.length > 0) ||
            (props.data.thumbnails && props.data.thumbnails.length > 0) ||
            (props.data.libraries && props.data.libraries.length > 0)
          "
          class="flex flex-col items-center flex-[1] min-w-0 min-height-0"
        >
          <div class="self-start" v-if="props.data">
            <h2 class="title">{{ props.data.name }}</h2>
            <span class="block">{{ props.data.date }}</span>
          </div>

          <FullscreenableImage
            v-for="(thumbnail, index) in props.data.thumbnails"
            :key="index"
            :src="path() + thumbnail"
            :alt="'Portfolio thumnail' + thumbnail"
            class="project-image"
          />

          <div class="tech-stack self-start funnel-text w-full">
            <StackComponent
              v-if="props.data.techstack"
              :title="t('techStack')"
              :elements="props.data.techstack"
            />

            <StackComponent
              v-if="props.data.libraries"
              :title="t('library')"
              :elements="props.data.libraries"
            />
          </div>
        </div>

        <div class="flex-[5] min-w-0 min-height-0">
          <component
            v-if="
              typeof props.data.displaytext === 'string' &&
              props.data.displaytext[0] == '@' &&
              resolveProjectComponent(props.data.displaytext.slice(1))
            "
            :is="resolveProjectComponent(props.data.displaytext.slice(1))"
            :data="props.data"
          ></component>
          <div
            v-else
            v-html="props.data.displaytext"
            class="funnel-text text-white flickAtStart-2"
          ></div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <div class="flex flex-col">
        <div
          class="border-t-2 p-1 h-full items-center my-auto flex justify-end"
          v-if="props.data.endlinks"
        >
          <ProjectEndLink
            class="min-width: 0"
            v-for="(link, index) in props.data.endlinks"
            :key="index"
            :url="link.url"
            :thumbnail="link.thumbnail"
            :isDownload="link.isDownload"
          />
        </div>
        <DraggableWindowDocker v-if="device.size < MediaQuery.sm"></DraggableWindowDocker>
      </div>
    </template>
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
