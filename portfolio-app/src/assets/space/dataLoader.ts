import data from '@/assets/json/projectsData.json'
import { System } from './solarSystem/system'
import type { RawData, TypedData } from '@/types/objectData'
import { LocalTranslator } from '@/composables/UseLocalTranslator'
import { useProjectStore } from '@/stores/projectStore'
import type Context from './Context'

//load data from json and translate to locale

export default class dataLoader {
  locale = LocalTranslator.locale

  // Generate systems from projects data (json)
  // Looping from categories to systems and projects to planets

  generateSystemsFromData(systems: System[], ctx: Context): System[] {
    this.loadData()

    const _data = enrichData(data as unknown as RawData) as TypedData
    const localeData = _data[this.locale]

    if (!localeData) return systems

    for (let i = 0; i < localeData.categories.length; i++) {
      const category = localeData.categories[i]
      if (!category) continue

      const system = new System(i, ctx, category.name)
      system.name = category.name || 'Error while loading category name'

      if (category.projects) {
        for (const projData of Object.values(category.projects)) {
          system.push(projData)
        }
      }

      const castedSunData = category
      system.setSunData(castedSunData)

      systems.push(system)
    }

    return systems
  }

  loadData() {
    const _data = enrichData(data as RawData) as TypedData
    useProjectStore().registerProjects(_data)
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!)
}

function makeArchivePlanet(categorySlug: string, categoryName: string, projects: RawData[string]['categories'][number]['projects'][number][]): TypedData[string]['categories'][number]['projects'][number] {
  const count = projects.length
  const archiveName = categorySlug === 'about-anvi' ? 'Anvi Wadhwa' : `${categoryName} Archive`
  const description = categorySlug === 'about-anvi'
    ? (projects[0]?.description ?? 'About Anvi Wadhwa')
    : `${count} ${categoryName.toLowerCase()} entries. Browse the system menu to explore every item and its details.`
  const displaytext = `<div class="archive-content"><p class="archive-intro">${escapeHtml(categorySlug === 'about-anvi' ? 'Profile · research · interests · contact' : `${count} ${categoryName.toLowerCase()} entries · select a link to explore further`)}</p>${projects.map((project) => {
    const date = project.date ? `<time>${escapeHtml(project.date)}</time>` : ''
    const tags = (project.tags ?? []).map((tag) => `<span class="archive-chip">${escapeHtml(tag)}</span>`).join('')
    const details = project.displaytext || `<p>${escapeHtml(project.description)}</p>`
    return `<article class="archive-entry"><header><h2>${escapeHtml(project.name)}</h2>${date}</header>${tags ? `<div class="archive-tags">${tags}</div>` : ''}<div class="archive-body">${details}</div></article>`
  }).join('')}</div>`

  return {
    slug: 'archive',
    name: archiveName,
    description,
    type: 'ProjectData',
    ressourcespath: `${categorySlug}/archive/`,
    displaytext,
    images: [],
    carousel: [],
    thumbnails: [],
    tags: count > 1 ? [`${count} entries`] : (projects[0]?.tags ?? []),
  }
}

export function enrichData(data: RawData): TypedData {
  const result: TypedData = {}

  for (const lang in data) {
    result[lang] = {
      categories: data[lang]!.categories.map((cat) => ({
        ...cat,
        type: 'CategoryData',
        ressourcespath: `${cat.slug}/`,
        projects: [makeArchivePlanet(cat.slug, cat.name, cat.projects)],
      })),
    }
  }

  return result
}
