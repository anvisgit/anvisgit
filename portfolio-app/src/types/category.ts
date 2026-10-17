import { type ObjectData } from './objectData'

export type Category = {
  slug: string
  name: string
  description: string
  images?: string[]
  carousel?: string[]
  projects?: ObjectData[]
}

export type Project = {
  categories: Category[]
}
