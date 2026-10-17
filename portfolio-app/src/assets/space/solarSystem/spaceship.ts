import { SpaceObject } from './spaceObject'
import p5 from 'p5'
import { Planet } from './planet'
import type Context from '../Context'
import PerformanceWatcher from '../PerformanceWatcher'
import { publicAssetUrl } from '@/composables/usePublicAssetUrl'

export enum SpaceShipBehavior {
  GoToPlanet,
  FreeFlight,
  FollowMouse,
  All,
}

export class SpaceShip extends SpaceObject {
  private yaw = 0
  private pitch = 0
  private roll = 0
  private targetYaw = 0
  private targetPitch = 0
  private velocity = new p5.Vector(0, 0, 0)

  acceleration = 10
  maxSpeed = 30
  turnSpeed = 0.05
  behavior: SpaceShipBehavior[]
  activeBehavior?: SpaceShipBehavior

  private lastDirChange = 0
  shipModel?: p5.Geometry = undefined
  shipTexture?: p5.Image = undefined
  shipShader?: p5.Shader = undefined

  planetList?: Planet[] = undefined
  targetPlanet?: Planet = undefined
  private targetPos = new p5.Vector(-10, 10, 10)
  private p: p5
  private font?: p5.Font

  constructor(
    ctx: Context,
    name: string,
    size: number,
    x: number,
    y: number,
    z: number = 0,
    behavior?: SpaceShipBehavior[],
  ) {
    super(name, size, x, y, z)
    this.p = ctx.p
    this.behavior = behavior ?? []
    this.activeBehavior = this._setRandomActiveBehavior()
    this._loadFont()
  }

  draw() {
    if (PerformanceWatcher.quality < 0.3) return

    this.p.push()

    this.p.translate(this.x, this.y, this.z)

    if (this.font) {
      this.p.fill(255)
      this.p.textSize(25)
      this.p.textFont(this.font)

      if (this.activeBehavior == SpaceShipBehavior.FollowMouse) {
        /*this.p.rotateX(-45)
        this.p.text('?', 0, 0)
        this.p.rotateX(45)*/
        this.p.stroke(200, 200, 255)
        this.p.strokeWeight(1)
        const mousePos = this.p.screenToWorld(this.p.mouseX, this.p.mouseY, 0.8)
        const dist = p5.Vector.dist(new p5.Vector(0, 0, 0), mousePos)
        const norm = p5.Vector.normalize(p5.Vector.sub(mousePos, new p5.Vector(0, 0, 0)))
        const t =
          ((this.p.millis() + this.yaw * this.pitch * this.roll) % (500 / dist)) / (500 / dist)
        const missilePos = p5.Vector.mult(norm, t * dist)
        this.p.line(
          missilePos.x - 5 * norm.x,
          missilePos.y - 5 * norm.y,
          missilePos.z - 5 * norm.z, // optionnel pour largeur
          missilePos.x + 5 * norm.x,
          missilePos.y + 5 * norm.y,
          missilePos.z + 5 * norm.z,
        )
      }
    }

    this.p.rotateY(this.yaw)
    this.p.rotateX(this.pitch)
    this.p.rotateZ(this.roll)

    this.p.noStroke()
    this.p.scale(this.size / 50)
    //p.fill(255, 0, 0)
    //console.log('this.shipShader', this.shipShader)

    if (this.shipShader && this.shipModel && this.shipTexture) {
      this.p.shader(this.shipShader)
      this.shipShader.setUniform('uTime', this.p.millis() / 1000.0)
      this.shipShader.setUniform('uTexture', this.shipTexture)
      this.shipShader.setUniform('uGlitchScale', 10.0)
      this.p.texture(this.shipTexture)
      this.p.model(this.shipModel)
      // this.p.resetShader()
    }

    this.p.pop()
  }

  async _loadFont() {
    this.font = await this.p.loadFont(publicAssetUrl('fonts/Doto-Black.ttf'))
  }

  update() {
    if (PerformanceWatcher.quality < 0.3) return

    // GoToPlanet : travel from one planet to another one
    // FreeFlight : choose a random direction every x second and go forward
    // Follow the mouse cursor
    const worldPos = this.p.screenToWorld(this.p.mouseX, this.p.mouseY, 0.8)
    const distToMouse = p5.Vector.dist(new p5.Vector(this.x, this.y, this.z), worldPos)
    if (distToMouse < 100) {
      this.activeBehavior = SpaceShipBehavior.FollowMouse
    } else if (this.activeBehavior === SpaceShipBehavior.FollowMouse && distToMouse > 300) {
      this._setRandomActiveBehavior()
    }

    switch (this.activeBehavior) {
      case SpaceShipBehavior.GoToPlanet:
        const isArrived = this.targetPlanet ? this.isArrived(this.targetPlanet.size + 10) : true

        if (!isArrived && this.targetPlanet) {
          this.setDirectionToTarget(
            new p5.Vector(this.targetPlanet.x, this.targetPlanet.y, this.targetPlanet.z),
          )
          this.moveForward()
        } else if (this.targetPos && isArrived && this.targetPlanet) {
          this._setRandomActiveBehavior()
          this.targetPlanet = this._getRandomPlanet()
        }

        break

      case SpaceShipBehavior.FreeFlight:
        if (this.p.millis() - this.lastDirChange > 1000) {
          this.lastDirChange = this.p.millis() + Math.random() * 5000
          this.choseRandomDirection()
          this.moveForward()
          if (Math.random() < 0.8) this._setRandomActiveBehavior()
        } else {
          this.moveForward()
        }
        break

      case SpaceShipBehavior.FollowMouse:
        this.setDirectionToTarget({ x: worldPos.x, y: worldPos.y, z: worldPos.z })
        this.moveForward()
        break
    }
  }

  angleLerp(a: number, b: number, t: number) {
    let diff = b - a

    // ramène dans [-PI, PI]
    diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI

    return a + diff * t
  }

  moveForward() {
    this.yaw = this.angleLerp(this.yaw, this.targetYaw, this.turnSpeed)
    this.pitch = this.angleLerp(this.pitch, this.targetPitch, this.turnSpeed)

    const forward = new p5.Vector(
      Math.cos(this.pitch) * Math.sin(this.yaw),
      -Math.sin(this.pitch),
      Math.cos(this.pitch) * Math.cos(this.yaw),
    )

    const dt = this.p.deltaTime / 1000

    // F = direction * acceleration
    forward.mult(this.acceleration)
    // v = v + F
    this.velocity.add(forward)

    // limiter la vitesse
    this.velocity.limit(this.maxSpeed)

    this.x += this.velocity.x * dt
    this.y += this.velocity.y * dt
    this.z += this.velocity.z * dt

    //friction
    this.velocity.mult(0.89)
  }

  private _setRandomActiveBehavior() {
    const choices = this.behavior.filter(
      (v) => v !== SpaceShipBehavior.All && v !== SpaceShipBehavior.FollowMouse,
    )
    if (choices.length === 0) return this.activeBehavior // rien à changer
    return (this.activeBehavior = choices[Math.floor(Math.random() * choices.length)])
  }

  _getRandomPlanet() {
    if (this.planetList) {
      return this.planetList[Math.floor(Math.random() * this.planetList.length)]
    }
    return undefined
  }

  targetToRandomPlanet() {
    this.targetPlanet = this._getRandomPlanet()
    if (this.targetPlanet) {
      this.setDirectionToTarget(
        new p5.Vector(this.targetPlanet.x, this.targetPlanet.y, this.targetPlanet.z),
      )
      this.moveForward()
    }
  }

  choseRandomDirection() {
    const dy = Math.random() * Math.PI - Math.PI / 2
    const dp = Math.random() * Math.PI - Math.PI / 2

    this.targetYaw += dy
    this.targetPitch += dp
  }

  setDirectionToTarget(param: { x?: number; y?: number; z?: number; v?: p5.Vector }) {
    this.targetPos = param.v ? param.v : new p5.Vector(param.x, param.y, param.z)

    const localTargetPoint = p5.Vector.sub(this.targetPos, new p5.Vector(this.x, this.y, this.z))

    const yaw = Math.atan2(localTargetPoint.x, localTargetPoint.z)
    const distXZ = Math.sqrt(
      localTargetPoint.x * localTargetPoint.x + localTargetPoint.z * localTargetPoint.z,
    )
    if (distXZ < 0.0001) return
    const pitch = -Math.atan2(localTargetPoint.y, distXZ)

    this.targetYaw = yaw
    this.targetPitch = pitch
  }

  isArrived(maxDist = 0): boolean {
    if (this.targetPlanet)
      return (
        p5.Vector.dist(this.targetPos, new p5.Vector(this.x, this.y, this.z)) <
        this.targetPlanet.size + maxDist
      )
    return false
  }
}
