import { ref } from 'vue'

export default class PerformanceWatcher {
  public static quality = 0
  public static frameRate = 0
  public static isUpdating = false
  /*
  Trick to trigger update in Vue component when quality changes, 
  because I wanted to keep the component independant of the framework for reusability
  */
  public static triggerUpdate = ref(false)

  private static _previousframeRate = 0
  private static _previousQuality = 0

  private static _lastTime = performance.now()
  private static _frameTime = 0
  private static _samples: number[] = []

  private static _warmupFrames = 5
  private static _frameCount = 0

  /* If frame time is above or below target * these multipliers, decrease or increase quality */
  private static _frameTimeMultiplierToDown = 1.5
  private static _frameTimeMultiplierToUp = 0.9
  /* Same thresholds in frame rate */
  public static maxThresholdFps = 25
  public static minThresholdFps = 17

  private static updatePerf() {
    const now = performance.now()
    const dt = now - this._lastTime
    this._lastTime = now

    this._samples.push(dt)
    if (this._samples.length > 20) this._samples.shift()

    this._frameTime = this._samples.reduce((a, b) => a + b, 0) / this._samples.length

    this.frameRate = 1000 / this._frameTime
    if (Math.abs(this.frameRate - this._previousframeRate) > 1) {
      this.triggerUpdate.value = !this.triggerUpdate.value
      this._previousframeRate = this.frameRate
    }
  }

  public static adaptQuality(targetFps: number = 25) {
    this.updatePerf()

    if (this._frameCount < this._warmupFrames) {
      this._frameCount++
      return
    }

    const TARGET = 1000.0 / targetFps
    this.maxThresholdFps = 1000 / (TARGET * this._frameTimeMultiplierToUp)
    this.minThresholdFps = 1000 / (TARGET * this._frameTimeMultiplierToDown)

    if (this._frameTime > TARGET * this._frameTimeMultiplierToDown) {
      this.quality = Math.max(0, this.quality - 0.01)
    }

    const nextQuality = Math.min(1, this.quality + 0.01)

    if (this._frameTime <= TARGET * this._frameTimeMultiplierToUp && this.quality != 1) {
      this.quality = nextQuality
    }

    if (this.quality !== this._previousQuality) {
      this.isUpdating = true
      this.triggerUpdate.value = !this.triggerUpdate.value
    } else if (this.isUpdating) {
      this.isUpdating = false
      this.triggerUpdate.value = !this.triggerUpdate.value
    }
    this._previousQuality = this.quality
  }
}
