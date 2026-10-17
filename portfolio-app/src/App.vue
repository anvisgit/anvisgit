<script setup lang="ts">
import { RouterView } from 'vue-router'
import { initCookieConsent } from './stores/globalStore'

initCookieConsent()
</script>

<template>
  <header></header>
  <RouterView />
</template>

<style scoped></style>
