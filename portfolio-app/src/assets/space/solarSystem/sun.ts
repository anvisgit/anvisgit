import p5 from 'p5'
import { SpaceObject } from './spaceObject'
import type Context from '../Context'

export class Sun extends SpaceObject {
  color: p5.Color
  sunShader: p5.Shader | undefined = undefined

  private p: p5

  constructor(name: string, radius: number, x: number, y: number, color: p5.Color, ctx: Context) {
    super(name, radius, x, y, 0)
    this.p = ctx.p
    this.color = color
  }

  draw(sizeOffset: number = 0, isGlitching: boolean = false): void {
    if (this.sunShader) {
      this.p.push()
      this.p.noStroke()
      this.p.fill(255)
      this.p.translate(this.x, this.y, 0)
      this.p.resetShader()
      this.p.shader(this.sunShader)
      this.sunShader.setUniform('uTime', this.p.millis() / 1000.0)
      this.sunShader.setUniform('uGlitch', isGlitching)
      this.sunShader.setUniform('uColor', [1, 1, 1, 1])
      this.p.sphere(this.size + sizeOffset, 33, 20)
      this.p.translate(-this.x, -this.y, 0)
      this.p.pop()
    }
  }
}
