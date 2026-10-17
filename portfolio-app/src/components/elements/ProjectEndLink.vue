<script setup lang="ts">
const props = defineProps<{
  url: string
  thumbnail: string
  isDownload?: boolean
}>()
</script>

<template>
  <a
    v-if="props.thumbnail.split('.').length > 1 && props.isDownload"
    class="space-button p-1 bg-white rounded-md ml-2 h-full"
    style="display: flex; align-items: center"
    target="blank"
    :href="props.url"
    download
  >
    <img style="max-width: 40px" :src="'link_images/' + props.thumbnail" class="h-full"
  /></a>
  <a v-else-if="props.isDownload" class="" target="blank" :href="props.url" download>
    <button class="w-max p-2 h-full glass-effect ml-2 text-center block">
      {{ props.thumbnail }}
    </button>
  </a>
  <a
    v-else-if="props.thumbnail.split('.').length > 1"
    class="space-button p-1 bg-white rounded-md ml-2 h-full"
    style="display: flex; align-items: center"
    target="blank"
    :href="props.url"
  >
    <img style="max-width: 40px" :src="'link_images/' + props.thumbnail" class="h-full"
  /></a>
  <a v-else class="" target="blank" :href="props.url">
    <button class="w-max p-2 h-full glass-effect ml-2 text-center block">
      {{ props.thumbnail }}
    </button>
  </a>
</template>
