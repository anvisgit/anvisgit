export type ObjectDataBase = {
  type: string
  slug: string
  name: string
  description: string
  ressourcespath?: string
}

export type ProjectData = ObjectDataBase & {
  type: 'ProjectData'
  date?: string
  images?: string[]
  carousel?: string[]
  displaytext?: string
  tags?: string[]
  thumbnails?: string[]
  pages?: [{ slug: string; title: string; content: string }]
  techstack?: Tech[]
  libraries?: Tech[]

  endlinks?: {
    thumbnail: string
    url: string
    isDownload?: boolean
  }[]
}

export type CategoryData = ObjectDataBase & {
  type: 'CategoryData'
  projects: ProjectData[]
}

export type Tech = {
  thumbnail: string
  name: string
  url?: string
}

export type ObjectData = ProjectData | CategoryData

export type RawProject = Omit<ProjectData, 'type'>

export type RawCategory = Omit<CategoryData, 'type' | 'projects'> & {
  projects: RawProject[]
}

export type RawData = {
  [lang: string]: {
    categories: RawCategory[]
  }
}

export type TypedData = Record<string, { categories: CategoryData[] }>
