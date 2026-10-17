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
    <div class="view category-view p-5" :class="`category-view-${props.data.slug}`">
      <header class="category-intro">
        <p class="category-kicker">{{ t('inthissystem') }}</p>
        <h2 class="category-heading">{{ props.data.name }}</h2>
        <p class="category-description" v-html="props.data.description" />
      </header>

      <div class="category-list">
        <article class="category-entry" v-for="(project, index) in props.data.projects" :key="index">
          <div class="category-entry-heading">
            <span class="category-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="category-entry-title">
              <h3>{{ project.name }}</h3>
              <p v-if="project.date" class="category-date">{{ project.date }}</p>
            </div>
          </div>

          <div class="category-entry-body">
            <FullscreenableImage
              v-if="project.thumbnails?.length"
              :src="'project_images/' + project.ressourcespath + project.thumbnails![0]"
              :alt="project.name"
              class="category-image"
            />
            <div class="category-copy" v-html="project.description" />
          </div>

          <div v-if="project.tags?.length" class="category-tags">
            <TagComponent
              v-for="(tag, tagIndex) in project.tags"
              :key="tagIndex"
              :toShow="tag"
            />
          </div>
          <div v-if="project.pages?.length" class="category-pages">
            <h4>{{ t('additionalcontent') }}</h4>
            <span v-for="page in project.pages" :key="page.slug">{{ page.title }}</span>
          </div>
        </article>
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
.category-view {
  --category-accent: #80d8b0;
  --category-accent-soft: rgba(128, 216, 176, .12);
}
.category-view-research-projects {
  --category-accent: #88c9e8;
  --category-accent-soft: rgba(88, 170, 211, .13);
}
.category-view-writing-transmissions {
  --category-accent: #c4a5ed;
  --category-accent-soft: rgba(155, 112, 205, .14);
}
.category-view-research-experience {
  --category-accent: #e3b96c;
  --category-accent-soft: rgba(190, 139, 50, .13);
}
.category-view-campus-communities {
  --category-accent: #80d8b0;
  --category-accent-soft: rgba(74, 172, 129, .14);
}
.category-intro {
  max-width: 52rem;
  margin: 0 auto 1.5rem;
  padding: 0 0 1.1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--category-accent) 50%, transparent);
}
.category-kicker {
  margin: 0 0 .35rem;
  color: var(--category-accent);
  font: 600 .7rem/1.4 ui-monospace, SFMono-Regular, Consolas, monospace;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.category-heading {
  margin: 0;
  color: var(--retro-chalk, #e8e5d9);
  font-size: clamp(1.4rem, 3vw, 2rem);
  line-height: 1.2;
}
.category-description {
  margin: .55rem 0 0;
  color: rgba(232, 229, 217, .75);
  line-height: 1.65;
}
.category-list { display: grid; gap: 1rem; }
.category-entry {
  min-width: 0;
  padding: 1rem 1.1rem;
  border: 1px solid color-mix(in srgb, var(--category-accent) 36%, transparent);
  border-left: 3px solid var(--category-accent);
  border-radius: .65rem;
  background: linear-gradient(110deg, var(--category-accent-soft), rgba(8, 11, 9, .42) 58%);
}
.category-entry-heading { display: flex; align-items: flex-start; gap: .8rem; }
.category-index {
  flex: 0 0 auto;
  padding-top: .15rem;
  color: var(--category-accent);
  font: 600 .75rem/1.5 ui-monospace, SFMono-Regular, Consolas, monospace;
}
.category-entry-title { min-width: 0; }
.category-entry-title h3 {
  margin: 0;
  color: var(--retro-chalk, #e8e5d9);
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.4;
  overflow-wrap: anywhere;
}
.category-date {
  margin: .2rem 0 0;
  color: var(--category-accent);
  font: 500 .78rem/1.5 ui-monospace, SFMono-Regular, Consolas, monospace;
}
.category-entry-body { display: grid; grid-template-columns: minmax(0, 1fr); gap: .85rem; margin: .8rem 0 0 2rem; }
.category-copy { min-width: 0; color: rgba(232, 229, 217, .88); line-height: 1.7; overflow-wrap: anywhere; }
.category-copy :deep(p) { margin: 0 0 .65rem; }
.category-copy :deep(p:last-child) { margin-bottom: 0; }
.category-copy :deep(ul) { margin: .55rem 0 0; padding-left: 1.2rem; list-style: disc; }
.category-copy :deep(li) { margin: .25rem 0; padding-left: .15rem; }
.category-copy :deep(a) { color: var(--category-accent); text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--category-accent) 55%, transparent); text-underline-offset: .2em; }
.category-copy :deep(a:hover) { color: var(--retro-chalk, #e8e5d9); }
.category-image { width: 100%; max-height: 18rem; border-radius: .45rem; object-fit: cover; }
.category-tags { display: flex; flex-wrap: wrap; gap: .4rem; margin: .85rem 0 0 2rem; }
.category-pages { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; margin: .9rem 0 0 2rem; }
.category-pages h4 { width: 100%; margin: 0; color: var(--category-accent); font-size: .8rem; }
.category-pages span { padding: .3rem .55rem; border: 1px solid color-mix(in srgb, var(--category-accent) 48%, transparent); border-radius: .35rem; color: var(--retro-chalk, #e8e5d9); font-size: .8rem; }
@media (min-width: 800px) {
  .category-entry-body:has(.category-image) { grid-template-columns: minmax(10rem, .75fr) minmax(0, 1.5fr); }
}
@media (max-width: 639px) {
  .category-view { padding: 1rem; }
  .category-entry { padding: .85rem; }
  .category-entry-body, .category-tags, .category-pages { margin-left: 0; }
}
</style>
