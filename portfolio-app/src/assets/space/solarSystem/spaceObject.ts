import type { ObjectData } from '@/types/objectData'

export class SpaceObject {
  x: number
  y: number
  z: number
  name: string
  size: number
  data: ObjectData | undefined = undefined

  constructor(name: string, size: number, x: number, y: number, z: number = 0) {
    this.name = name
    this.size = size
    this.x = x
    this.y = y
    this.z = z
  }
}
