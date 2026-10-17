import type { Component } from 'vue'

const components = import.meta.glob('@/components/projectPages/*.vue', {
  eager: true,
})

type VueModule = { default: Component }

const projectComponents: Record<string, Component> = Object.fromEntries(
  Object.entries(components).map(([path, module]) => {
    const name = path.split('/').pop()!.replace('.vue', '')
    return [name, (module as VueModule).default]
  }),
)
export default function resolveProjectComponent(name?: string) {
  if (!name) return
  return projectComponents[name]
}
