// Source - https://stackoverflow.com/a
// Posted by bikeman868, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-19, License - CC BY-SA 4.0

import { reactive } from 'vue'

export enum MediaQuery {
  xs,
  sm,
  md,
  lg,
  xl,
}

export type DeviceInfo = {
  windowWidth: number
  size: MediaQuery
}

const calcSize = (width: number): MediaQuery => {
  if (width < 768) return MediaQuery.xs
  if (width < 1024) return MediaQuery.sm
  if (width < 1280) return MediaQuery.md
  if (width < 2048) return MediaQuery.lg
  return MediaQuery.xl
}

const deviceInfo = reactive({
  windowWidth: window.innerWidth,
  size: MediaQuery.xs,
})

deviceInfo.size = calcSize(window.innerWidth)

window.addEventListener('resize', () => {
  const width = window.innerWidth
  deviceInfo.windowWidth = width
  deviceInfo.size = calcSize(width)
})

export const useDevice = (): DeviceInfo => {
  return deviceInfo
}

export default useDevice
