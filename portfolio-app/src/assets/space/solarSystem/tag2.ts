import p5 from 'p5'
import { SpaceObject } from './spaceObject'
import type Context from '../Context'
import { publicAssetUrl } from '@/composables/usePublicAssetUrl'

export class Tag2 extends SpaceObject {
  text: string
  size: number
  onClick: (() => void) | null
  color: p5.Color

  private font: p5.Font | undefined
  private p: p5
  private ctx: Context

  constructor(param: {
    ctx: Context
    text: string
    size: number
    color?: p5.Color
    callback?: () => void
    toFollow?: SpaceObject
    x?: number
    y?: number
    z?: number
  }) {
    if (param.toFollow)
      super(
        param.text,
        param.size,
        param.toFollow.x,
        param.toFollow.y + param.toFollow.size * 2,
        param.toFollow.z,
      )
    else super(param.text, param.size, param.x ?? 0, param.y ?? 0, param.z ?? 0)

    this.text = param.text
    this.size = param.size
    this.onClick = param.callback ?? null
    this.p = param.ctx.p
    this.ctx = param.ctx
    this.color = param.color ?? this.p.color(255)
    this._loadFont()
  }

  async _loadFont() {
    this.font = await this.p.loadFont(publicAssetUrl('fonts/Doto-Black.ttf'))
  }

  draw() {
    const SlideW = 50
    const SlideH = 300
    const secondLineW = 50

    this.p.push()
    this.p.smooth()
    this.p.stroke(this.color)
    this.p.strokeWeight(2)
    this.p.translate(this.x, this.y, this.z)
    this.p.rotateX(-45)
    this.p.line(0, 0, SlideW, SlideH)
    this.p.line(SlideW, SlideH, SlideW + secondLineW, SlideH)
    if (this.font) {
      this.p.fill(this.color)
      this.p.textSize(25)
      this.p.textFont(this.font)
    }
    this.p.textAlign(this.p.LEFT, this.p.CENTER)
    this.p.rectMode(this.p.CENTER)
    this.p.text(this.text, SlideW + secondLineW + 10, SlideH - 5)
    this.p.noFill()
    this.p.rect(
      SlideW +
        secondLineW +
        (this.p.textBounds(this.text, SlideW + secondLineW, SlideH - 5).w + 20) / 2,
      SlideH - (this.p.textBounds(this.text, SlideW + secondLineW, SlideH - 5).h - 15) / 2,
      this.p.textBounds(this.text, SlideW + secondLineW, SlideH - 5).w + 20,
      -this.p.textBounds(this.text, SlideW + secondLineW, SlideH - 5).h - 15,
    )

    this.p.pop()
  }

  setColor(color: p5.Color) {
    this.color = color
  }
}
