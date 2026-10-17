<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { publicAssetUrl } from '@/composables/usePublicAssetUrl'

const code = ref('')

const props = defineProps<{
  nbOfLines?: number
  speed?: number
}>()

let codeIndex = 0
const speed = props.speed ?? 10

const codeText = [
  `import p5 from 'p5'
import { Planet } from './planet'
import { Sun } from './sun'

export class System {
  planets?: Planet[] = []
  sun?: Sun = undefined

  set(sun: Sun, planets: Planet[]) {
    this.sun = sun
    this.planets = planets
  }

  tick(time: number): void {
    this.planets?.forEach((planet) => {
      planet.tick(time)
    })
    this.sun?.tick(time)
  }

  draw(p: p5): void {
    this.sun?.draw(p)
    this.planets?.forEach((planet) => {
      planet.draw(p)
    })
  }

  generate(p: p5) {
    this.sun = new Sun('Sun', 30, p.width / 2, p.height / 2, p.color(255, 204, 0))
    console.log(this.sun)

    for (let i = 0; i < 5; i++) {
      const distanceFromSun = 150 + i * 70 + Math.random() * 30
      const planet = new Planet(
        \`Planet \${i + 1}\`,
        10 + Math.random() * 15,
        0.01 + Math.random() * 0.1,
        this.sun.x + distanceFromSun + Math.cos(Math.random() * Math.PI * 2) * distanceFromSun,
        this.sun.y + Math.sin(Math.random() * Math.PI * 2) * distanceFromSun,
        p.color(Math.random() * 255, Math.random() * 255, Math.random() * 255),
        this.sun,
        distanceFromSun,
        Math.random() * Math.PI * 2,
      )
      this.planets!.push(planet)
    }
  }
}
  
`,
  `import p5 from 'p5'
import { System } from './solarSystem/system'
import { SpaceShip } from './solarSystem/spaceship'
import { Planet } from './solarSystem/planet'
import { p5Ready, selectedSystemRef, selectorRef, systemsRef } from '@/stores/spaceStore'
import { dataLoader } from './dataLoader'
import { Selector } from './solarSystem/selector'

export const systems: System[] = []

export const sketch = (p: p5) => {
  let camPosX = 0
  let camPosY = 0
  let camPosZ = 0
  let selectedSystem: System | null = null
  let planetList: Planet[] = []

  const spaceShips: SpaceShip[] = []

  let cam: p5.Camera

  let ready = false

  p.setup = async () => {
    p.createCanvas(innerWidth, innerHeight, p.WEBGL)

    const shader = await p.loadShader(
      publicAssetUrl('shaders/holographic.vert'),
      publicAssetUrl('shaders/holographic.frag'),
    )
    const shaderUnicolor = await p.loadShader(
      publicAssetUrl('shaders/holographic_unicolor.vert'),
      publicAssetUrl('shaders/holographic_unicolor.frag'),
    )
    const model = await p.loadModel(publicAssetUrl('models/ship.obj'))
    const texture = await p.loadImage(publicAssetUrl('textures/ship_Texture.png'))

    const dataLoaderInstance = new dataLoader()
    dataLoaderInstance.generateSystemsFromData(systems, p)
    systems.forEach((system) => {
      if (system.sun) system.sun.sunShader = shaderUnicolor
      if (system.planets) {
        planetList = planetList.concat(system.planets)
        system.planets.forEach((planet) => {
          planet.planetShader = shaderUnicolor
        })
      }
    })

    systemsRef.value = systems
    p5Ready.value = true

    if (selectedSystemRef.value === null && systems.length > 0) {
      selectedSystemRef.value = systems[0] ?? null
    }

    const button = p.createButton('submit')
    button.position(20, 65)

    for (let i = 0; i < 50; i++) {
      spaceShips.push(new SpaceShip(p, 'Avator', 150, 0, 0, 0))
    }

    spaceShips.forEach((spaceShip, index) => {
      const planet = planetList[Math.floor(Math.random() * planetList.length)]
      spaceShip.x = planet!.x
      spaceShip.y = planet!.y
      spaceShip.z = planet!.z
      spaceShip.planetList = planetList
      console.log(spaceShip.planetList)
      if (systems) {
        const rndSys = Math.floor(Math.random() * systems.length)
        if (systems[rndSys] && systems[rndSys].planets) {
          const rndPla = Math.floor(Math.random() * systems[rndSys].planets.length)
          if (systems[rndSys].planets[rndPla]) {
            spaceShip.targetPlanet = systems[rndSys].planets[rndPla]
            console.log(index, systems[rndSys].planets[rndPla])
          }
        }
      }
      spaceShip.shipShader = shader
      spaceShip.shipModel = model
      spaceShip.shipTexture = texture
    })

    cam = p.createCamera()
    cam.setPosition(0, 1000, 1000)
    cam.lookAt(0, 0, 0)
    p.setCamera(cam)

    ready = true
  }

  p.draw = () => {
    if (!ready) return

    p.clear()
    p.fill(255)
    p.stroke(150)
    systems.forEach((system) => {
      system.tick(p.millis() / 1000)
    })
    spaceShips.forEach((spaceShip) => {
      spaceShip.update(p)
    })
    selectorRef.value?.draw(p, cam)
    cam.setPosition(camPosX, camPosY, 1000 + camPosZ)
    updateCam()
  
    systems.forEach((system) => {
      system.draw(selectorRef.value as Selector)
    })
    spaceShips.forEach((spaceShip) => {
      spaceShip.draw(p)
    })
    
  }

  p.keyPressed = () => {
    if (p.key === 'q' || p.key === 'a') {
      camPosX -= 10
    }
    if (p.key === 'd') {
      camPosX += 10
    }
    if (p.key === 'z' || p.key === 'w') {
      camPosY -= 10
    }
    if (p.key === 's') {
      camPosY += 10
    }
  }

  p.mouseWheel = (event: WheelEvent) => {
    if (event.deltaY > 0) {
      //camScale *= 0.9
      camPosZ += 100
    } else if (event.deltaY < 0) {
      //camScale *= 1.1
      camPosZ -= 100
    }
  }

  let isMiddleDragging = false
  let lastMX = 0
  let lastMY = 0

  p.mousePressed = () => {
    if (p.mouseButton.center) {
      isMiddleDragging = true
      lastMX = p.mouseX
      lastMY = p.mouseY
    }
    raycastClickOnElements()
  }

  p.mouseReleased = () => {
    if (!p.mouseButton.center) {
      isMiddleDragging = false
    }
  }

  p.mouseDragged = () => {
    if (isMiddleDragging) {
      const dx = p.mouseX - lastMX
      const dy = p.mouseY - lastMY

      camPosX -= dx
      camPosY -= dy

      lastMX = p.mouseX
      lastMY = p.mouseY
    }
  }

  function updateCam() {
    if (selectedSystemRef.value != selectedSystem) {
      if (selectedSystemRef.value) {
        const speed = 0.2
        camPosX = p.lerp(camPosX, selectedSystemRef.value.sun!.x, speed)
        camPosY = p.lerp(camPosY, selectedSystemRef.value.sun!.y + 1000, speed)
        camPosZ = p.lerp(camPosZ, selectedSystemRef.value.sun!.z, speed)
      }
    }

    if (
      selectedSystemRef.value &&
      selectedSystemRef.value.sun &&
      p5.Vector.dist(
        new p5.Vector(
          selectedSystemRef.value.sun.x,
          selectedSystemRef.value.sun.y + 1000,
          selectedSystemRef.value.sun.z,
        ),
        new p5.Vector(camPosX, camPosY, camPosZ),
      ) < 10
    ) {
      selectedSystem = selectedSystemRef.value
    }
  }

  function raycastClickOnElements() {
    for (const system of systems) {
      if (system.sun) {
        if (
          p5.Vector.dist(
            p.worldToScreen(system.sun.x, system.sun.y, 0),
            new p5.Vector(system.p.mouseX, system.p.mouseY, 0),
          ) <
          p5.Vector.dist(
            p.worldToScreen(system.sun.x, system.sun.y, 0),
            p.worldToScreen(system.sun.x + system.sun.size, system.sun.y, 0),
          )
        ) {
          if (p.mouseIsPressed && selectorRef.value) {
            selectorRef.value.selectedObject = system.sun
          }
        }
      }

      system.planets?.forEach((planet) => {
        const screenPos = p.worldToScreen(planet.x, planet.y, 0)
        const mousePos = new p5.Vector(p.mouseX, p.mouseY, 0)
        if (
          p5.Vector.dist(screenPos, mousePos) <
          p5.Vector.dist(screenPos, p.worldToScreen(planet.x + planet.size, planet.y, 0))
        ) {
          if (p.mouseIsPressed && selectorRef.value) {
            selectorRef.value.selectedObject = planet
          }
        }
      })
    }
  }
}
`,
  `import { SpaceObject } from './spaceObject'
import p5 from 'p5'
import { Planet } from './planet'

export class SpaceShip extends SpaceObject {
  yaw = 0
  pitch = 0
  roll = 0
  targetYaw = 0
  targetPitch = 0

  acceleration = 10
  velocity = new p5.Vector(0, 0, 0)
  maxSpeed = 30
  turnSpeed = 0.05

  lastDirChange = 0
  shipModel: p5.Geometry | undefined = undefined
  shipTexture: p5.Image | undefined = undefined
  shipShader: p5.Shader | undefined = undefined

  planetList: Planet[] | undefined = undefined
  targetPlanet: Planet | undefined = undefined
  targetPos = new p5.Vector(-10, 10, 10)
  goToPlanet = false
  p: p5

  constructor(p: p5, name: string, size: number, x: number, y: number, z: number = 0) {
    super(name, size, x, y, z)
    this.p = p
  }

  draw(p: p5) {
    p.push()

    p.translate(this.x, this.y, this.z)
    p.rotateY(this.yaw)
    p.rotateX(this.pitch)
    p.rotateZ(this.roll)

    p.noStroke()
    p.push()
    p.scale(this.size / 50)

    if (this.shipShader && this.shipModel && this.shipTexture) {
      p.shader(this.shipShader)
      this.shipShader.setUniform('uTime', p.millis() / 1000.0)
      this.shipShader.setUniform('uTexture', this.shipTexture)
      this.shipShader.setUniform('uGlitchScale', 10.0)
      p.texture(this.shipTexture)
      p.model(this.shipModel)
    }

    p.pop()

    p.pop()
  }

  update(p: p5) {
    const isArrived = this.targetPlanet ? this.isArrived(this.targetPlanet.size + 10) : 10

    if (!isArrived && this.targetPlanet && this.goToPlanet) {
      this.setDirectionToTarget()
      this.moveForward(p)
    } else if (this.targetPos && isArrived && this.targetPlanet && this.goToPlanet) {
      this.goToPlanet = Math.random() > 0.5
      this.targetPlanet = this.getRandomPlanet()
    } else if (!this.goToPlanet && p.millis() - this.lastDirChange > 1000) {
      this.lastDirChange = p.millis() + Math.random() * 5000
      this.goToPlanet = Math.random() < 0.9
      this.choseRandomDirection()
      this.moveForward(p)
    } else {
      this.moveForward(p)
    }
  }

  angleLerp(a: number, b: number, t: number) {
    let diff = b - a

    diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI

    return a + diff * t
  }

  moveForward(p: p5) {
    this.yaw = this.angleLerp(this.yaw, this.targetYaw, this.turnSpeed)
    this.pitch = this.angleLerp(this.pitch, this.targetPitch, this.turnSpeed)

    const forward = new p5.Vector(
      Math.cos(this.pitch) * Math.sin(this.yaw),
      -Math.sin(this.pitch),
      Math.cos(this.pitch) * Math.cos(this.yaw),
    )

    const dt = p.deltaTime / 1000

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
    this.velocity.mult(0.99)
  }

  getRandomPlanet() {
    if (this.planetList) {
      return this.planetList[Math.floor(Math.random() * this.planetList.length)]
    }
    return undefined
  }

  choseRandomDirection() {
    const dy = Math.random() * Math.PI - Math.PI / 2
    const dp = Math.random() * Math.PI - Math.PI / 2

    this.targetYaw += dy
    this.targetPitch += dp
  }

  setDirectionToTarget() {
    if (this.targetPlanet) {
      this.targetPos = new p5.Vector(this.targetPlanet.x, this.targetPlanet.y, this.targetPlanet.z)

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
`,
]

let index = 0
let toShow = ''
const nbOfLinesToShow = props.nbOfLines ?? 20
const typingInterval = setInterval(() => {
  if (
    !codeText ||
    codeText[codeIndex] == undefined ||
    codeText[codeIndex] == null ||
    !codeText[codeIndex]
  ) {
    return
  }
  toShow += codeText[codeIndex]!.charAt(index)
  code.value = toShow
  index++

  if (code.value.split('\n').length > nbOfLinesToShow) {
    toShow = toShow.split('\n').slice(1).join('\n')
    code.value = toShow
  }
  if (index > codeText[codeIndex]!.length) {
    index = 0
  }
}, speed)

onMounted(() => {
  codeIndex = Math.floor(Math.random() * (codeText.length - 1))
})

onUnmounted(() => {
  clearInterval(typingInterval)
})
</script>

<template>
  <pre class="codeSample pointer-events-none doto-text" v-text="code"></pre>
</template>

<style scoped>
.codeSample {
  /*padding: 200px 200px 0px 100px;*/
  overflow: hidden;
  color: rgb(100, 100, 100) !important;
}
</style>
