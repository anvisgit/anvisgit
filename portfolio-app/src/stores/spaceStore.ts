import { shallowRef } from 'vue'
import type { System } from '@/assets/space/solarSystem/system'
import { Selector } from '@/assets/space/solarSystem/selector'

//Access to the different systems to display them in the UI and to select them
export const systemsRef = shallowRef<System[]>([])
//Selected System in the UI Menu to transmit it to the 3D scene
export const selectedSystemRef = shallowRef<System | null>(null)
//Tells the App if the p5 instance is ready
export const p5Ready = shallowRef<boolean>(false)

//Visual Selection of the system in the 3D scene
export const selector = new Selector('#ffffff')

export function resetStore() {
  systemsRef.value = []
  selectedSystemRef.value = null
  p5Ready.value = false
  selector.reset?.()
}

export function selectorDeselect() {
  selector.selectedObject = null
}
