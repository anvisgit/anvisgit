import { Sun } from './sun'
import p5 from 'p5'
import { SpaceObject } from './spaceObject'
import type { ObjectData } from '@/types/objectData'
import type Context from '../Context'
import PerformanceWatcher from '../PerformanceWatcher.ts'

export class Planet extends SpaceObject {
  color: p5.Color
  description: string = ''
  revolutionSpeed: number = 0.01
  distanceFromSun: number = 10
  angleFromSun: number = 0
  private sun: Sun | null = null

  private p: p5
  private ctx: Context

  private shape: p5.Geometry
  private shapeLOD: p5.Geometry
  private shapeLOD2: p5.Geometry

  planetShader: p5.Shader | undefined = undefined
  private orbitPoints: { x: number; y: number }[] = []

  constructor(
    ctx: Context,
    name: string,
    radius: number,
    revolutionSpeed: number,
    x: number,
    y: number,
    color: p5.Color,
    sun: Sun | null = null,
    distanceFromSun: number = 100,
    angleFromSun: number = 0,
    projectData?: ObjectData,
  ) {
    super(name, radius, x, y)
    this.color = color
    this.sun = sun
    this.distanceFromSun = distanceFromSun
    this.revolutionSpeed = revolutionSpeed
    this.angleFromSun = angleFromSun
    this.p = ctx.p
    this.ctx = ctx
    this.data = projectData

    const p = this.p
    this.shape = this.p.buildGeometry(function () {
      p.sphere(radius, 24, 24)
    })
    this.shapeLOD = this.p.buildGeometry(function () {
      p.sphere(radius, 8, 6)
    })
    this.shapeLOD2 = this.p.buildGeometry(function () {
      p.sphere(radius, 4, 3)
    })
    this._calculateOrbitPoints()
  }

  setDescription(description: string): void {
    this.description = description
  }

  private _orbit(time: number): void {
    if (this.sun === null) return

    this.x =
      this.sun.x + Math.cos(time * this.revolutionSpeed + this.angleFromSun) * this.distanceFromSun
    this.y =
      this.sun.y + Math.sin(time * this.revolutionSpeed + this.angleFromSun) * this.distanceFromSun
  }

  drawOrbit(d = 0): void {
    if (this.sun === null) return

    if (PerformanceWatcher.quality < 0.4) {
      this.p.push()
      this.p.stroke(255)
      if (PerformanceWatcher.quality > 0.3) {
        this.p.stroke(255, 255, 255, 255 - (PerformanceWatcher.quality - 0.3) * 10 * 255)
      }
      this.p.strokeWeight(1)
      this.p.noFill()
      this.p.ellipse(this.sun.x, this.sun.y, this.distanceFromSun * 2, this.distanceFromSun * 2, 50)
      this.p.pop()
      if (PerformanceWatcher.quality < 0.3) return
    }

    this.p.push()

    this.p.stroke(255)

    const scale = Math.min(2 / (d / 1000), 10)
    this.p.strokeWeight(scale < 0 ? 0 : scale)
    this.p.stroke(255, 255, 255, 255 / (d / 1000))

    /*for (const point of this.orbitPoints) {
      this.p.point(point.x, point.y, 2)
    }*/
    this.p.beginShape(this.p.POINTS)
    for (const point of this.orbitPoints) {
      this.p.vertex(point.x, point.y)
    }
    this.p.endShape()
    this.p.pop()
  }

  _calculateOrbitPoints(): void {
    if (this.sun === null) return

    const step = 1 / (0.01 * 2 * Math.PI * this.distanceFromSun)
    const numPoints = Math.round((2 * Math.PI) / step)

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2
      const orbitX = this.sun.x + Math.cos(angle) * this.distanceFromSun
      const orbitY = this.sun.y + Math.sin(angle) * this.distanceFromSun
      this.orbitPoints.push({ x: orbitX, y: orbitY })
    }
  }

  tick(time: number): void {
    this._orbit(time)
  }

  draw(sizeOffset: number = 0, isGlitching: boolean = false): void {
    const dx = this.sun!.x - this.ctx.camera.eyeX
    const dy = this.sun!.y - this.ctx.camera.eyeY
    const dz = this.sun!.z - this.ctx.camera.eyeZ

    const d = Math.sqrt(dx * dx + dy * dy + dz * dz)

    if (d > 6000) return

    if (this.planetShader) {
      this.p.push()
      this.drawOrbit(d)
      this.p.noStroke()
      this.p.fill(this.color)
      this.p.translate(this.x, this.y, 0)
      this.p.scale(1 + sizeOffset / 10)
      this.p.shader(this.planetShader)
      this.planetShader.setUniform('uTime', this.p.millis() / 1000.0)
      this.planetShader.setUniform('uGlitch', isGlitching)
      const r = this.p.red(this.color) // 120
      const g = this.p.green(this.color) // 200
      const b = this.p.blue(this.color) // 8
      this.planetShader.setUniform('uColor', [r / 255.0, g / 255.0, b / 255.0, 1])
      this.p.model(d > 2000 ? (d > 4000 ? this.shapeLOD2 : this.shapeLOD) : this.shape)
      this.p.pop()
    }
  }
}
