import { defineStore } from 'pinia'

interface WindowState {
  zIndex: number
  name: string
  docked: boolean
}

export const useWindowZIndexStore = defineStore('window', {
  state: () => ({
    topZ: 10,
    isAnyWindowDocked: false,
    windows: {} as Record<string, WindowState>,
  }),

  actions: {
    register(id: string, wname: string, wdocked: boolean = false) {
      if (!this.windows[id]) {
        this.topZ++
        this.windows[id] = { zIndex: this.topZ, name: wname, docked: wdocked }

        this._checkIfDockedWindows()
      }
    },

    bringToFront(id: string) {
      if (!this.windows[id]) return
      this.topZ++
      this.windows[id].zIndex = this.topZ
    },

    unregister(id: string) {
      delete this.windows[id]

      this._checkIfDockedWindows()
    },

    toggleDocked(id: string) {
      if (!this.windows[id]) return
      this.windows[id].docked = !this.windows[id].docked

      this._checkIfDockedWindows()
    },

    _checkIfDockedWindows() {
      const dockedList = Object.entries(this.windows).filter(([, w]) => w.docked)
      this.isAnyWindowDocked = dockedList.length > 0
    },

    clearStore() {
      this.windows = {}
      this.topZ = 10
      this.isAnyWindowDocked = false
    },
  },
})
