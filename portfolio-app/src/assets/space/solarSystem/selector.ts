import p5 from 'p5'
import type { SpaceObject } from './spaceObject'

export class Selector {
  selectedObject: SpaceObject | null = null
  preselectedObject: SpaceObject | null = null
  color: string

  private size = 256

  constructor(color: string) {
    this.color = color
  }

  reset() {
    this.selectedObject = null
    this.preselectedObject = null
  }

  draw(p: p5, cam: p5.Camera) {
    if (!this.selectedObject) return

    // Créer le graphics directement sans le mettre en cache
    const gfx = p.createGraphics(this.size, this.size)
    const obj = this.selectedObject

    gfx.clear()
    gfx.noFill()
    gfx.stroke(this.color)
    gfx.strokeWeight(10)
    gfx.rectMode(gfx.CENTER)

    const anim = ((Math.cos(p.millis() / 400) + 1) / 2) * 10
    const half = this.size / 2 - 20 - anim
    const line = this.size / 5

    const x1 = this.size / 2 - half
    const y1 = this.size / 2 - half
    const x2 = this.size / 2 + half
    const y2 = this.size / 2 + half

    gfx.line(x1, y1, x1 + line, y1)
    gfx.line(x1, y1, x1, y1 + line)

    gfx.line(x2, y1, x2 - line, y1)
    gfx.line(x2, y1, x2, y1 + line)

    gfx.line(x1, y2, x1 + line, y2)
    gfx.line(x1, y2, x1, y2 - line)

    gfx.line(x2, y2, x2 - line, y2)
    gfx.line(x2, y2, x2, y2 - line)

    const camPos = p.createVector(cam.eyeX, cam.eyeY, cam.eyeZ)
    const camTarget = p.createVector(cam.centerX, cam.centerY, cam.centerZ)
    const camUp = p.createVector(cam.upX, cam.upY, cam.upZ)

    const forward = p5.Vector.sub(camTarget, camPos).normalize()
    const right = forward.copy().cross(camUp).normalize()
    const up = right.copy().cross(forward).normalize()

    p.push()

    p.linePerspective(false)

    p.translate(obj.x, obj.y, obj.z)

    p.applyMatrix(
      right.x,
      right.y,
      right.z,
      0,
      up.x,
      up.y,
      up.z,
      0,
      -forward.x,
      -forward.y,
      -forward.z,
      0,
      0,
      0,
      0,
      1,
    )

    p.noStroke()
    p.texture(gfx)

    const worldSize = obj.size * 2 + 30
    p.plane(worldSize, worldSize)

    p.pop()

    // Nettoyer le graphics créé
    gfx.remove()
  }
}
