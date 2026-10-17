<script setup lang="ts">
import { path } from '@/composables/usePublicImagePath'

const githubPath = import.meta.env.VITE_GITHUB_PATH
const publicBaseUrl = import.meta.env.BASE_URL
</script>

<template>
  <div>
    <img
      :src="path() + 'Plants_garden.png'"
      alt="Image de plant generator"
      style="width: 60%; max-width: 500px; border-radius: 8px; flex: 1 1 300px; object-fit: cover"
    />
    <div style="margin: 20px; color: white; display: flex; flex-direction: row-reverse">
      <button class="space-button text-white doto-text" style="padding: 20px; right: 10px">
        Tester le projet
      </button>
      <a
        class="space-button glass-effect"
        style="
          margin-right: 1rem;
          padding: 0 0.5rem;
          position: relative;
          display: flex;
          align-items: center;
        "
        target="blank"
        :href="githubPath + 'Plant-generator.git'"
      >
        <img style="width: 40px; height: 40px" :src="`${publicBaseUrl}tags/github.svg`"
      /></a>
    </div>
  </div>
</template>

<style scoped></style>
