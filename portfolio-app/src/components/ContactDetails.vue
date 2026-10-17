<script setup lang="ts">
import DraggableWindow from '@/components/DraggableWindow.vue'

const emit = defineEmits<{ close: [] }>()
const links = [
  { label: 'Personal email', value: 'anviwadhwa7@gmail.com', href: 'mailto:anviwadhwa7@gmail.com', kind: 'email' },
  { label: 'VIT email', value: 'anvi.wadhwa2024@vitstudent.ac.in', href: 'mailto:anvi.wadhwa2024@vitstudent.ac.in', kind: 'email' },
  { label: 'LinkedIn', value: 'linkedin.com/in/anviwadhwa', href: 'https://in.linkedin.com/in/anviwadhwa7', kind: 'web' },
  { label: 'GitHub', value: 'github.com/anvisgit', href: 'https://github.com/anvisgit', kind: 'web' },
  { label: 'Medium', value: 'medium.com/@anviwadhwa7', href: 'https://medium.com/@anviwadhwa7', kind: 'web' },
]
</script>

<template>
  <DraggableWindow
    id="contact-details"
    display-name="Contact Anvi"
    class="contact-details-window flickAtStart"
    center-at-start
    fullscreenOnMobile
    fullscreenable
    dockable
    :dissmissable="true"
    :on-close="() => emit('close')"
  >
    <template #title>
      <h2 class="contact-details-title">CONTACT / ANVI WADHWA</h2>
    </template>
    <div class="contact-details-content">
      <p class="contact-details-intro">Let’s connect about research, ideas, or a good question.</p>
      <a
        v-for="link in links"
        :key="link.label"
        class="contact-link"
        :class="`contact-link--${link.kind}`"
        :href="link.href"
        :target="link.kind === 'web' ? '_blank' : undefined"
        rel="noopener noreferrer"
      >
        <span class="contact-link-label">{{ link.label }}</span>
        <span class="contact-link-value">{{ link.value }}</span>
        <span class="contact-link-arrow">↗</span>
      </a>
    </div>
  </DraggableWindow>
</template>

<style scoped>
.contact-details-window { width: min(520px, calc(100vw - 24px)); max-height: 82vh; }
.contact-details-title { color: #44ff00; font: 700 15px/1.4 'Doto', monospace; letter-spacing: .08em; }
.contact-details-content { display: grid; gap: 9px; padding: 20px; }
.contact-details-intro { margin: 0 0 8px; color: #d5f5c8; font: 400 15px/1.6 'Funnel Display', sans-serif; }
.contact-link { display: grid; grid-template-columns: 110px minmax(0,1fr) 20px; align-items: center; gap: 8px; padding: 12px; border: 1px solid rgba(68,255,0,.32); background: rgba(2,12,8,.7); text-decoration: none; }
.contact-link:hover { border-color: #00e5ff; box-shadow: 0 0 14px rgba(0,229,255,.18); }
.contact-link-label { color: #ffe600; font: 700 11px/1.4 'Doto', monospace; text-transform: uppercase; }
.contact-link-value { overflow-wrap: anywhere; color: #d5f5c8; font: 400 14px/1.5 'Funnel Display', sans-serif; }
.contact-link-arrow { color: #00e5ff; }
@media (max-width: 520px) { .contact-link { grid-template-columns: 1fr 20px; } .contact-link-label { grid-column: 1 / -1; } }
</style>
