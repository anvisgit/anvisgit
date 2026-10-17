<script setup lang="ts">
import LoadingScreen from '@/components/LoadingScreen.vue'
import router from '@/router'
import { onMounted } from 'vue'

onMounted(() => {
  setTimeout(() => {
    router.push('/portfolio')
  }, 7100)
})
</script>

<template>
  <LoadingScreen />
</template>

<style></style>
