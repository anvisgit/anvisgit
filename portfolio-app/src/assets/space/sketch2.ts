import p5 from 'p5'
import { publicAssetUrl } from '@/composables/usePublicAssetUrl'

export const sketch2 = (p: p5) => {
  let shader: p5.Shader | undefined = undefined
  let shipModel: p5.Geometry | undefined = undefined
  let shipTexture: p5.Image | undefined = undefined

  p.setup = async () => {
    p.createCanvas(innerWidth, p.windowHeight, p.WEBGL)

    shader = await p.loadShader(
      publicAssetUrl('shaders/holographic.vert'),
      publicAssetUrl('shaders/holographic.frag'),
    )
    shipModel = await p.loadModel(publicAssetUrl('models/ship.obj'))
    shipTexture = await p.loadImage(publicAssetUrl('textures/ship_Texture.png'))
  }

  p.draw = () => {
    //p.translate(-p.width / 2, -p.height / 2, 0)
    p.clear()
    p.fill(255)
    //p.background(255)
    p.fill(255, 0, 0)
    //p.ellipse(0, 0, 100)

    p.push()

    p.rotateY(p.millis() / 1000.0)
    p.translate(0, 100, 350)
    p.rotateX(0)
    p.rotateZ(3.14)

    p.noStroke()
    p.scale(100)

    if (shader && shipModel && shipTexture) {
      p.shader(shader)
      shader.setUniform('uTime', p.millis() / 1000.0)
      shader.setUniform('uTexture', shipTexture)
      shader.setUniform('uGlitchScale', 200.0)
      p.texture(shipTexture)
      p.model(shipModel)
      //  p.resetShader()
    } else {
      console.log('Shader, model or texture not loaded yet')
    }

    p.pop()
  }
}
