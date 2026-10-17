import { ref } from 'vue'
import type { ObjectData, TypedData } from '@/types/objectData'
import router from '@/router'
import { LocalTranslator } from '@/composables/UseLocalTranslator'

import { defineStore } from 'pinia'

const _projects = ref<Record<string, ObjectData>>({})

export const useProjectStore = defineStore('project', {
  state: () => ({
    selectedData: <ObjectData | undefined>undefined,
    preselectedData: <ObjectData | undefined>undefined,
  }),

  getters: {},

  actions: {
    async selectProject(category?: string, slug?: string) {
      if (category && slug && category != '' && slug != '') {
        await router.push({ query: { project: category + '-' + slug } })
      } else if (category && category != '') {
        await router.push({ query: { project: category } })
      } else {
        await router.push({ query: {} })
      }
      return this.resolveProjectFromQuery()
    },

    resolveProjectFromQuery() {
      const project = router.currentRoute.value.query.project as string | undefined
      if (project) {
        this.selectedData = _projects.value[project]
        return _projects.value[project]
      }
      this.selectedData = undefined
      return undefined
    },

    registerProjects(data: TypedData) {
      const lang = LocalTranslator.getLocale()
      const categories = data[lang]
      if (categories) {
        for (const cat of categories.categories) {
          _projects.value[cat.slug] = cat
          for (const proj of cat.projects) {
            _projects.value[`${cat.slug}-${proj.slug}`] = proj
          }
        }
      }
    },
  },
})
