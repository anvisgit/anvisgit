import 'p5'

declare module 'p5' {
  interface p5 {
    preload?: () => void
    touchStarted?: (event?: TouchEvent) => void
  }
}
