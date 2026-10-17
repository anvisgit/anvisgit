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
  const isAbout = categorySlug === 'about-anvi'
  const intro = isAbout ? '' : `<p class="archive-intro">${count} ${escapeHtml(categoryName.toUpperCase())} ENTRIES · SELECT A LINK TO EXPLORE FURTHER</p>`
  const entries = projects.map((project) => {
    const details = project.displaytext || `<p>${escapeHtml(project.description)}</p>`
    const tags = (project.tags ?? []).map((tag) => `<span class="archive-chip">${escapeHtml(tag)}</span>`).join('')

    if (isAbout) {
      const aboutDetails = details.replace(/<\/h2>/i, `</h2>${tags ? `<div class="archive-tags">${tags}</div>` : ''}`)
      return `<section class="archive-panel archive-about"><div class="archive-body">${aboutDetails}</div></section>`
    }

    const date = project.date
      ? `<time>${categorySlug === 'campus-communities' ? project.date.split('; ').map(escapeHtml).join('<br>') : escapeHtml(project.date)}</time>`
      : ''
    const showTags = categorySlug !== 'writing-transmissions' && tags
      ? `<div class="archive-tags">${tags}</div>`
      : ''
    return `<article class="archive-card"><header><h2>${escapeHtml(project.name)}</h2>${date}</header>${showTags}<div class="archive-body">${details}</div></article>`
  }).join('')
  const displaytext = `<div class="archive-portfolio archive-${escapeHtml(categorySlug)}">${intro}<div class="archive-card-grid">${entries}</div></div>`

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
