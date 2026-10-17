import p5 from 'p5'
import { Planet } from './planet'
import { Sun } from './sun'
import type { Selector } from './selector'
import type { ProjectData, CategoryData } from '@/types/objectData'
import { Tag } from './tag'
import { Poline, positionFunctions } from 'poline'
import { StarCloud } from './starCloud'
import convert from 'color-convert'
import type Context from '../Context'
import { useDevice, MediaQuery } from '@/composables/UseMediaQueries'

export class System {
  planets?: Planet[] = []
  sun?: Sun = undefined
  tag?: Tag = undefined
  name: string = 'Unnamed System'
  starCluster: { x: number; y: number; z: number; s: number }[] = []
  starCloud?: StarCloud = undefined
  color: p5.Color
  colorPalette: string[] = []

  private p: p5
  private ctx: Context
  private deviceInfos = useDevice()

  constructor(index: number = 0, ctx: Context, name: string = 'Sun') {
    this.p = ctx.p
    this.ctx = ctx

    this.color = this.p.color(Math.random() * 255, Math.random() * 255, Math.random() * 255)

    const angle = Math.random() * 3.14 * 2
    const coordX = 0 + Math.cos(angle) * (1000 * index)
    const coordY = 0 + Math.sin(angle) * (1000 * index)

    this.sun = new Sun(
      name,
      30,
      this.p.width / 2 + coordX,
      this.p.height / 2 + coordY,
      this.color,
      ctx,
    )

    this.tag = new Tag({
      ctx: this.ctx,
      text: this.sun.name,
      size: 10,
      toFollow: this.sun,
      color: this.color,
    })

    this.starCloud = new StarCloud(this.sun.x, this.sun.y, this.sun.z, 500, 2000, ctx)
  }

  set(sun: Sun, planets: Planet[]): void {
    this.sun = sun
    this.planets = planets
  }

  tick(time: number): void {
    this.planets?.forEach((planet) => {
      planet.tick(time)
    })
  }

  draw(selector: Selector): void {
    if (this.sun) {
      if (selector.selectedObject == this.sun || selector.preselectedObject == this.sun) {
        this.sun.draw(5, true)
      } else {
        this.sun.draw()
      }
    }

    const boostSize = this.deviceInfos.size < MediaQuery.sm ? 5 : 0
    this.planets?.forEach((planet) => {
      if (selector.selectedObject == planet || selector.preselectedObject == planet) {
        planet.draw(5, true)
      } else {
        planet.draw(boostSize)
      }
    })

    this.tag?.draw()

    this.starCloud?.draw()

    this.showTuto()
  }

  //generate a basic system around the sun
  generate() {
    for (let i = 0; i < 5; i++) {
      this.push()
    }
  }

  //Push a new planet in the system and add it the project's data
  push(planetData?: ProjectData) {
    if (this.planets === undefined) {
      this.planets = []
    }
    if (this.sun === undefined) {
      alert('Cannot add planet to system without sun')
      return
    }

    const distanceFromSun = 150 + (this.planets.length + 1) * 70 + Math.random() * 30
    const planet = new Planet(
      this.ctx,
      planetData?.name ?? `Planet ${this.planets.length + 1}`,
      10 + Math.random() * 15,
      0.01 + Math.random() * 0.1,
      this.sun.x + distanceFromSun + Math.cos(Math.random() * Math.PI * 2) * distanceFromSun,
      this.sun.y + Math.sin(Math.random() * Math.PI * 2) * distanceFromSun,
      this.colorPalette[this.planets.length - 1] != undefined
        ? this.p.color(this.colorPalette[this.planets.length - 1] as string)
        : this.p.color(255, 255, 255),
      this.sun,
      distanceFromSun,
      Math.random() * Math.PI * 2,
      planetData,
    )

    this.planets.push(planet)

    this._RegenerateSystemColors()
  }

  //Set the sun data
  setSunData(data?: CategoryData) {
    if (data && this.sun) this.sun.data = data
  }

  private _generateColorPalette(baseColor?: string, nbOfColors: number = 10): string[] {
    if (!baseColor) {
      const poline = new Poline({ numPoints: nbOfColors })
      // On veut une palette HSL CSS (hsl(...))
      return poline.colors.map(([h, s, l]) => '#' + convert.hsl.hex(h, s * 100, l * 100))
    }

    // Convert hex to HSL
    const c = this.p.color(baseColor)
    const h = this.p.hue(c)
    const s = this.p.saturation(c) / 100 // p5 saturation 0-100, poline 0-1
    const l = this.p.lightness(c) / 100 // p5 lightness 0-100, poline 0-1

    // Create complementary anchor
    const h2 = (h + 180) % 360
    const poline = new Poline({
      anchorColors: [
        [h, s, l],
        [h2, s, l],
      ],
      numPoints: nbOfColors,
      positionFunctionX: positionFunctions.quadraticPosition,
      positionFunctionY: positionFunctions.linearPosition,
      positionFunctionZ: positionFunctions.quadraticPosition,
    })

    return poline.colors.map(([h, s, l]) =>
      this.clampHexColor('#' + convert.hsl.hex(h, s * 100, l * 100), 20, 100),
    )
  }

  private _RegenerateSystemColors() {
    if (!this.planets) return

    this.colorPalette = this._generateColorPalette(
      '#' +
        convert.hsl.hex(
          this.p.hue(this.color),
          this.p.saturation(this.color) / 100,
          this.p.lightness(this.color) / 100,
        ),
      this.planets.length,
    )
    this._dispachColorsToSystem()
  }

  private _dispachColorsToSystem() {
    if (this.sun) this.sun.color = this.p.color(this.colorPalette[0] ?? '#FFFFFF')
    if (this.tag) this.tag.color = this.p.color(this.colorPalette[0] ?? '#FFFFFF')
    this.planets?.forEach((planet, index) => {
      const colorHex = this.colorPalette[index] ?? '#FFFFFF'
      planet.color = this.p.color(colorHex)
    })
  }

  setColor(color: string) {
    this.color = this.p.color(color)

    if (this.planets) this.colorPalette = this._generateColorPalette(color, this.planets.length + 1)
    this._dispachColorsToSystem()
    this.tag?.setColor(this.color)
  }

  clampHexColor(hex: string, min = 0, max = 100) {
    const hsl = convert.hex.hsl(hex)

    hsl[2] = Math.min(max, Math.max(min, hsl[2]))

    return `#${convert.hsl.hex(hsl)}`
  }

  setupTuto() {}
  showTuto() {}
}
