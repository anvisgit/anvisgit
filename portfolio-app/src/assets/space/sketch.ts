import p5 from 'p5'
import { System } from './solarSystem/system'
import { SpaceShip, SpaceShipBehavior } from './solarSystem/spaceship'
import { Planet } from './solarSystem/planet'
import { p5Ready, selectedSystemRef, selector, systemsRef } from '@/stores/spaceStore'
import { useProjectStore } from '@/stores/projectStore'
import { middleMouseclickAppened } from '@/stores/globalStore'
import dataLoader from './dataLoader.ts'
import type { SpaceObject } from './solarSystem/spaceObject'
import { hasFocus } from '@/composables/UseP5Canvas'
import type Context from './Context'
import PerformanceWatcher from './PerformanceWatcher.ts'
import { useDevice, MediaQuery } from '@/composables/UseMediaQueries.ts'
import { publicAssetUrl } from '@/composables/usePublicAssetUrl'

export const sketch = (p: p5) => {
  const systems: System[] = []
  const MAX_SHIPS = 50
  let camPosX = 0
  let camPosY = 0
  let camPosZ = 0
  const camDist = useDevice().size <= MediaQuery.sm ? 500 : 1
  let selectedSystem: System | null = null
  let planetList: Planet[] = []

  const spaceShips: SpaceShip[] = []

  let cam: p5.Camera
  let camInMovement = false

  //let glowShader: p5.Shader | undefined = undefined

  let ready = false

  let bkg: p5.Image | undefined = undefined
  let bkg2: p5.Image | undefined = undefined

  let canvas: p5.Renderer | undefined = undefined

  let ctx: Context

  p.setup = async () => {
    console.log('P5 setup called')
    dropPreviousSetup()
    canvas = p.createCanvas(innerWidth, innerHeight, p.WEBGL)
    //p.pixelDensity(1)
    canvas.id('mainCanvas')

    p.frameRate(30.5)

    cam = p.createCamera()
    cam.setPosition(0, 1000, 500)
    cam.lookAt(0, 0, 0)
    p.setCamera(cam)

    ctx = {
      p: p,
      camera: cam,
    }

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
    dataLoaderInstance.generateSystemsFromData(systems, ctx)

    systems.forEach((system) => {
      system.setColor('#ffffff')
      if (system.sun) system.sun.sunShader = shaderUnicolor
      if (system.planets) {
        planetList = planetList.concat(system.planets)
        system.planets.forEach((planet) => {
          planet.planetShader = shaderUnicolor
          planet.tick(p.millis() / 1000)
        })
      }
    })

    systemsRef.value = systems
    p5Ready.value = true

    if (selectedSystemRef.value === null && systems.length > 0) {
      selectedSystemRef.value = systems[0] ?? null
    }

    for (let i = 0; i < planetList.length * 2; i++) {
      if (spaceShips.length + 1 < MAX_SHIPS) {
        spaceShips.push(
          new SpaceShip(ctx, 'Avator', 150, 0, 0, 0, [
            SpaceShipBehavior.FollowMouse,
            SpaceShipBehavior.FreeFlight,
            SpaceShipBehavior.GoToPlanet,
          ]),
        )
      }
    }

    spaceShips.forEach((spaceShip) => {
      const planet = planetList[Math.floor(Math.random() * planetList.length)]
      spaceShip.x = planet!.x
      spaceShip.y = planet!.y
      spaceShip.z = planet!.z
      spaceShip.planetList = planetList

      /*if (systems) {
        const rndSys = Math.floor(Math.random() * systems.length)
        if (systems[rndSys] && systems[rndSys].planets) {
          const rndPla = Math.floor(Math.random() * systems[rndSys].planets.length)
          if (systems[rndSys].planets[rndPla]) {
            spaceShip.targetPlanet = systems[rndSys].planets[rndPla]
          }
        }
      }*/
      spaceShip.targetToRandomPlanet()
      spaceShip.shipShader = shader
      spaceShip.shipModel = model
      spaceShip.shipTexture = texture
    })

    bkg = await p.loadImage(publicAssetUrl('textures/night_stars.png'))
    bkg2 = await p.loadImage(publicAssetUrl('textures/nebula.png'))

    ready = true
  }

  function dropPreviousSetup() {
    systems.length = 0
    camPosX = 0
    camPosY = 0
    camPosZ = 0
    selectedSystem = null
    planetList = []
    spaceShips.length = 0
    camInMovement = false
    ready = false
    bkg = undefined
    bkg2 = undefined
    if (canvas) canvas.remove()
  }

  p.draw = () => {
    if (!ready || (useDevice().size <= MediaQuery.sm && selector.selectedObject != null)) return

    /*
    Max framerate is 30 in the sketch,
    but we want the quality degradation to only begin when the frame rate drops to 25 fps
    that way, I'm aiming for a more stable adaptation when maximum quality is reached
    */
    PerformanceWatcher.adaptQuality(25)

    p.clear()
    p.fill(255)

    systems.forEach((system) => {
      system.tick(p.millis() / 1000)
    })
    const spaceShipsToRender = PerformanceWatcher.quality * spaceShips.length
    for (let i = 0; i < spaceShipsToRender; i++) {
      spaceShips[i]?.update()
    }

    cam.setPosition(
      camPosX + (p.mouseX - p.width / 2) / 50,
      camPosY - (p.mouseY - p.height / 2) / 50,
      500 + camPosZ,
    )
    updateCam()

    //@ts-expect-error - drawing context not in ts
    p.drawingContext.disable(p.drawingContext.DEPTH_TEST)

    const nebulaSize = 6000
    const dist = 0.1

    p.noStroke()

    if (bkg && bkg2) {
      let offset = 0.2
      if (PerformanceWatcher.quality > 0.1) {
        const opacity =
          PerformanceWatcher.quality < 0.2
            ? ((PerformanceWatcher.quality - 0.1) / (0.3 - 0.1)) * 100
            : 100

        p.push()
        p.translate(
          offset * camPosX + 500,
          offset * camPosY - 2500 * dist,
          offset * camPosZ - 1500 * dist,
        )
        p.rotateX((3.14 / 6) * 5)
        p.tint(255, 200, 200, opacity)
        p.texture(bkg2)
        p.plane(nebulaSize + 500, nebulaSize)
        p.pop()
        offset = 0
        p.push()
        p.translate(
          offset * camPosX - 500,
          offset * camPosY - 2500 * dist,
          offset * camPosZ - 1500 * dist,
        )
        p.rotateY(0)
        p.rotateX(90)

        p.tint(255, opacity)
        p.scale(1, 1, 1)
        p.texture(bkg2)
        p.plane(nebulaSize + 500, nebulaSize)
        p.pop()
        offset = 0.1
        p.push()
        p.translate(
          offset * camPosX - 1000,
          offset * camPosY - 2500 * dist,
          offset * camPosZ - 1500 * dist,
        )
        p.rotateY(0)
        p.rotateX(3.14)

        p.tint(255, opacity)
        p.scale(-1, 1, 1)
        p.texture(bkg2)
        p.plane(nebulaSize + 500, nebulaSize)
        p.pop()
      }

      if (PerformanceWatcher.quality > 0) {
        offset = 0.5
        p.push()
        p.translate(offset * camPosX + 500, offset * camPosY - 2500, offset * camPosZ - 1500)
        p.rotateX(90)
        p.fill(255)
        p.tint(255, 200)
        p.texture(bkg)
        p.plane(6000)
        p.pop()
        offset = 0.8
        p.push()
        p.translate(offset * camPosX + 500, offset * camPosY - 2500, offset * camPosZ - 1500)
        p.rotateX(90)
        p.fill(255)
        p.tint(255, 200)
        p.texture(bkg)
        p.plane(6000)
        p.pop()
      }
    }

    //@ts-expect-error - drawing context not in ts
    p.drawingContext.enable(p.drawingContext.DEPTH_TEST)

    selector.draw(p, cam)
    //drawGrid()

    systems.forEach((system) => {
      system.draw(selector)
    })

    for (let i = 0; i < spaceShipsToRender; i++) {
      spaceShips[i]?.draw()
    }

    moveCamOnKeyPressed()
  }

  p.mouseWheel = (event: WheelEvent) => {
    if (hasFocus) {
      selectedSystemRef.value = null
      selectedSystem = null
      // based on deltaY.
      if (event.deltaY > 0) {
        //camScale *= 0.9
        camPosY += 100
      } else if (event.deltaY < 0) {
        //camScale *= 1.1
        camPosY -= 100
      }
    }
  }

  let isMiddleDragging = false
  let isTouchDragging = false
  let touchStartX = 0
  let touchStartY = 0
  let hasTouchMoved = false
  let lastMX = 0
  let lastMY = 0

  p.mousePressed = () => {
    if (hasFocus) {
      if (p.mouseButton.center) {
        isMiddleDragging = true
        lastMX = p.mouseX
        lastMY = p.mouseY
      }
      raycastClickOnElements()
    }
  }

  // @ts-expect-error touchStarted not defined in types/p5 1.7.7
  p.touchStarted = () => {
    if (hasFocus) {
      isMiddleDragging = true
      isTouchDragging = true
      hasTouchMoved = false
      lastMX = p.mouseX
      lastMY = p.mouseY
      touchStartX = lastMX
      touchStartY = lastMY
      raycastClickOnElements()
    }
    return false
  }
  // @ts-expect-error touchStarted not defined in types/p5 1.7.7
  p.touchMoved = () => {
    if (hasFocus && isTouchDragging) {
      const touch = p.touches[0] as { x: number; y: number } | undefined
      const x = touch?.x ?? p.mouseX
      const y = touch?.y ?? p.mouseY

      if (!hasTouchMoved && Math.hypot(x - touchStartX, y - touchStartY) < 8) return false

      hasTouchMoved = true
      selector.selectedObject = null
      selector.preselectedObject = null
      selectedSystemRef.value = null
      selectedSystem = null
      camPosX -= x - lastMX
      camPosZ += y - lastMY
      lastMX = x
      lastMY = y
    }
    return false
  }

  // @ts-expect-error touchStarted not defined in types/p5 1.7.7
  p.touchEnded = () => {
    if (hasFocus && isTouchDragging && !hasTouchMoved) raycastClickOnElements()
    isMiddleDragging = false
    isTouchDragging = false
    hasTouchMoved = false
    return false
  }

  p.mouseMoved = () => {
    if (hasFocus) {
      raycastClickOnElements()
    }
  }

  p.mouseReleased = () => {
    if (!p.mouseButton.center) {
      isMiddleDragging = false
    }
  }

  p.mouseDragged = () => {
    if (isMiddleDragging && !isTouchDragging) {
      selectedSystemRef.value = null
      selectedSystem = null

      const dx = p.mouseX - lastMX
      const dy = p.mouseY - lastMY

      camPosX -= dx
      camPosZ += dy

      lastMX = p.mouseX
      lastMY = p.mouseY

      middleMouseclickAppened.value = true
    }
  }

  function moveCamOnKeyPressed() {
    let moved = false

    if (p.keyIsDown('q') || p.keyIsDown('a')) {
      camPosX -= 15
      moved = true
    }
    if (p.keyIsDown('d')) {
      camPosX += 15
      moved = true
    }
    if (p.keyIsDown('z') || p.keyIsDown('w')) {
      camPosY -= 15
      moved = true
    }
    if (p.keyIsDown('s')) {
      camPosY += 15
      moved = true
    }

    if (moved) {
      if (selectedSystemRef.value !== null) {
        selectedSystemRef.value = null
        selectedSystem = null
      }
    }
  }

  function updateCam() {
    if (selectedSystemRef) {
      //if the selected system has changed, we recenter the camera on the sun of the new selected system
      if (selectedSystemRef.value != selectedSystem) {
        if (selectedSystemRef.value) {
          const speed = (0.2 * 10) / p.frameRate()
          camPosX = p.lerp(camPosX, selectedSystemRef.value.sun!.x, speed)
          camPosY = p.lerp(camPosY, selectedSystemRef.value.sun!.y + 1000 + camDist, speed)
          camPosZ = p.lerp(camPosZ, selectedSystemRef.value.sun!.z + camDist / 2, speed)

          camInMovement = true
        }
      }

      //if the selected system has not yet reached the destination, we continue to move it
      if (
        selectedSystemRef.value &&
        selectedSystemRef.value.sun &&
        distSq(
          new p5.Vector(
            selectedSystemRef.value.sun.x,
            selectedSystemRef.value.sun.y + 1000,
            selectedSystemRef.value.sun.z,
          ),
          new p5.Vector(camPosX, camPosY, camPosZ),
        ) <
          10 ** 2
      ) {
        selectedSystem = selectedSystemRef.value
        camInMovement = false
      }

      //If the selected system has changed, we recenter the camera on the sun of the new selected system
      if (selectedSystemRef.value && selectedSystemRef.value == selectedSystem && camInMovement) {
        const speed = (0.2 * 10) / p.frameRate()
        camPosX = p.lerp(camPosX, selectedSystemRef.value.sun!.x, speed)
        camPosY = p.lerp(camPosY, selectedSystemRef.value.sun!.y + 1000, speed)
        camPosZ = p.lerp(camPosZ, selectedSystemRef.value.sun!.z, speed)
        if (
          selectedSystemRef.value &&
          selectedSystemRef.value.sun &&
          distSq(
            new p5.Vector(
              selectedSystemRef.value.sun.x,
              selectedSystemRef.value.sun.y + 1000,
              selectedSystemRef.value.sun.z,
            ),
            new p5.Vector(camPosX, camPosY, camPosZ),
          ) <
            10 ** 2
        ) {
          camInMovement = false
        }
      }
    }
  }

  //Optimizing performances by using squared distances
  function distSq(a: p5.Vector, b: p5.Vector) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return dx * dx + dy * dy
  }

  function raycastClickOnElements() {
    let hovered: SpaceObject | null = null
    let clicked: SpaceObject | null = null

    const objectClicked = (obj: SpaceObject) => {
      const screenPos = p.worldToScreen(obj.x, obj.y, 0)
      const offset = useDevice().size < MediaQuery.sm ? 5 / 10 : 1
      return (
        distSq(screenPos, new p5.Vector(p.mouseX, p.mouseY, 0)) <
        distSq(screenPos, p.worldToScreen(obj.x + obj.size + obj.size * offset, obj.y, 0))
      )
    }

    for (const system of systems) {
      for (const planet of system.planets ?? []) {
        if (objectClicked(planet)) {
          if (p.mouseIsPressed) {
            clicked = planet
          } else {
            hovered = planet
          }
          break
        }
      }
      if (hovered || clicked) break
    }

    useProjectStore().preselectedData = hovered?.data
    selector.preselectedObject = hovered
    if (clicked) {
      selector.selectedObject = clicked
      useProjectStore().selectProject(
        clicked?.data?.ressourcespath?.slice(0, -1).split('/')[0],
        clicked?.data?.ressourcespath?.slice(0, -1).split('/')[1],
      )
    }
  }

}
