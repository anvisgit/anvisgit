<!--

Reusable page template for project content.

This component uses the local translation system based on project and page context.
Translation keys are resolved dynamically using the following pattern:

<project-slug>-<page-slug>.json

Files are located in the "projectsTranslations" directory.

If no `pageindex` is provided, the template falls back to the project-level translations as a project's main page,
making it suitable for simple or prototype project page.

Content is structured using a key convention:
- tX       → section title (h2)
- tX-cY    → section content
- tX-sZ    → subsection title (h3)
- tX-sZ-cY → subsection content
- tX-sZ-iY  → image name
- tX-sZ-idY → image description
- ic       → image texte content

This allows flexible content rendering without hardcoding layout.

-->

<script setup lang="ts">
//Local translation
import { LocalTranslator } from '@/composables/UseLocalTranslator'
import { type ProjectData } from '@/types/objectData'
import { path } from '@/composables/usePublicImagePath'
import FullscreenableImage from '../elements/FullscreenableImage.vue'

const props = defineProps<{
  data: ProjectData
  pageindex?: number
}>()

const t = (key: string) =>
  LocalTranslator.getLT(
    key,
    props.data.slug,
    props.data.pages && props.pageindex != undefined
      ? props.data.pages[props.pageindex]?.slug
      : undefined,
  )

const sections = [1, 2, 3, 4, 5] // t1, t2 (tu ajoutes 3, 4... quand tu veux)
const contents = [1, 2, 3, 4, 5] // t1, t2 (tu ajoutes 3, 4... quand tu veux)
const subSections = [1, 2, 3, 4, 5]
const images = [1, 2, 3]

const exists = (key: string) => t(key) !== key
</script>

<template>
  <section class="p-5 project-description">
    <template v-for="i in sections" :key="'t' + i">
      <!-- Titre -->
      <h2 v-if="exists(`t${i}`)" class="title">
        {{ t(`t${i}`) }}
      </h2>

      <!-- Contenu principal -->

      <template v-for="k in images" :key="`t${i}-i${k}`">
        <FullscreenableImage
          v-if="exists(`t${i}-i${k}`)"
          class="h-auto my-0"
          :src="path() + t(`t${i}-i${k}`)"
          :alt="t(`t${i}-i${k}`)"
        />
        <span class="italic text-center mx-auto block justify-center" v-if="exists(`t${i}-id${k}`)">
          {{ t(`t${i}-id${k}`) }}
        </span>
      </template>

      <template v-for="c in contents" :key="'t' + c">
        <p v-if="exists(`t${i}-c${c}`)" class="funnel-text" v-html="t(`t${i}-c${c}`)"></p>
      </template>

      <!-- Sous-sections -->
      <template v-for="j in subSections" :key="`t${i}-s${j}`">
        <h3 v-if="exists(`t${i}-s${j}`)" class="title-2">
          {{ t(`t${i}-s${j}`) }}
        </h3>

        <template v-for="c in contents" :key="'t' + c">
          <p
            v-if="exists(`t${i}-s${j}-c${c}`)"
            class="funnel-text"
            v-html="t(`t${i}-s${j}-c${c}`)"
          ></p>
        </template>

        <div v-if="exists(`t${i}-s${j}-i1`)" class="grid grid-cols-4 gap-4">
          <div v-if="exists(`t${i}-s${j}-ic`)" class="col-span-2 justify-center my-auto">
            <p class="funnel-text" v-html="t(`t${i}-s${j}-ic`)"></p>
          </div>
          <div class="m-auto col-span-2">
            <template v-for="k in images" :key="`t${i}-s${j}-i${k}`">
              <FullscreenableImage
                v-if="exists(`t${i}-s${j}-i${k}`)"
                class="h-auto my-0"
                :src="path() + t(`t${i}-s${j}-i${k}`)"
                :alt="t(`t${i}-s${j}-i${k}`)"
              />
              <span
                class="italic text-center mx-auto block justify-center"
                v-if="exists(`t${i}-s${j}-id${k}`)"
              >
                {{ t(`t${i}-s${j}-id${k}`) }}
              </span>
            </template>
          </div>
        </div>
      </template>
    </template>
  </section>
</template>

<style scoped>
strong {
  font-style: normal !important;
  font-weight: bolder;
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
</style>
