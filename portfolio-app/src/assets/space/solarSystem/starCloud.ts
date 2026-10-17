import p5 from 'p5'
import type Context from '../Context'
import PerformanceWatcher from '../PerformanceWatcher.ts'

export class StarCloud {
  private stars: { x: number; y: number; z: number; s: number; r: number; g: number; b: number }[] =
    []
  private p: p5
  private ctx: Context

  constructor(x: number, y: number, z: number, numStars: number, spread: number, ctx: Context) {
    for (let i = 0; i < numStars; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.random() * spread

      this.stars.push({
        x: x != undefined ? x + r * Math.sin(phi) * Math.cos(theta) : 0,
        y: y != undefined ? y + r * Math.sin(phi) * Math.sin(theta) : 0,
        z: z != undefined ? z + r * Math.cos(phi) : 0,
        s: r / spread,
        r: 255 - Math.random() * 50,
        g: 255 - Math.random() * 50,
        b: 255 - Math.random() * 50,
      })
    }

    this.p = ctx.p
    this.ctx = ctx
  }

  draw() {
    /*if (PerformanceWatcher.quality < 0.45) {*/
    this.fastDraw()
    /*} else {
      this.detailedDraw()
    }*/
  }

  detailedDraw() {
    this.p.push()
    this.p.noStroke()

    const nbToRender = PerformanceWatcher.quality * this.stars.length

    for (let i = 0; i < nbToRender; i++) {
      const star = this.stars[i]
      if (star) {
        const dx = star.x - this.ctx.camera.eyeX
        const dy = star.y - this.ctx.camera.eyeY
        const dz = star.z - this.ctx.camera.eyeZ

        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const treshold = 3000 //PerformanceWatcher.quality < 0.5 ? 3000 : 10000
        if (d > treshold) continue

        const scale = (2 - star.s) / (d / 1000)

        this.p.stroke(star.r, star.g, star.b, 255 / (d / 2000))

        if (scale < 0.1) return

        this.p.strokeWeight(Math.floor(scale) <= 0 ? 0 : scale)

        this.p.point(star.x, star.y, star.z)
      }
    }
    this.p.pop()
  }

  fastDraw() {
    this.p.push()
    this.p.noStroke()

    const nbToRender = PerformanceWatcher.quality * this.stars.length

    if (nbToRender === 0) return

    this.p.beginShape(this.p.POINTS)

    let cumulativeposition = this.p.createVector(0, 0, 0)
    for (let i = 0; i < nbToRender; i++) {
      const star = this.stars[i]
      if (star) {
        cumulativeposition.x += star.x
        cumulativeposition.y += star.y
        cumulativeposition.z += star.z
      }
    }
    cumulativeposition = p5.Vector.div(cumulativeposition, nbToRender)

    const dx = cumulativeposition.x - this.ctx.camera.eyeX
    const dy = cumulativeposition.y - this.ctx.camera.eyeY
    const dz = cumulativeposition.z - this.ctx.camera.eyeZ

    const d = Math.sqrt(dx * dx + dy * dy + dz * dz)

    const scale = Math.min(2 / (d / 1000), 5)
    this.p.strokeWeight(Math.floor(scale) <= 0 ? 0 : scale)

    for (let i = 0; i < nbToRender; i++) {
      const star = this.stars[i]
      if (star) {
        const stardx = star.x - this.ctx.camera.eyeX
        const stardy = star.y - this.ctx.camera.eyeY
        const stardz = star.z - this.ctx.camera.eyeZ

        const d = Math.sqrt(stardx * stardx + stardy * stardy + stardz * stardz)
        const treshold = 3000 //PerformanceWatcher.quality < 0.5 ? 3000 : 10000
        if (d > treshold) continue

        this.p.stroke(star.r, star.g, star.b, 255 / (d / 2000) - star.s * 50)
        this.p.vertex(star.x, star.y, star.z)
      }
    }
    this.p.endShape()
    this.p.pop()
  }
}
