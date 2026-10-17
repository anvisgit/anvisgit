<script setup lang="ts">
const props = defineProps<{
  toShow: string
  onClick?: () => void
  href?: string
}>()
</script>

<template>
  <button class="tag" @click="props.onClick" :class="props.onClick ? '' : 'noClick'">
    <div class="flex items-center">
      <div v-if="props.toShow.split('.').length > 1">
        <img class="w-5 mr-3" :src="`tags/${props.toShow}`" :alt="props.toShow.split('.')[0]" />
      </div>
      <div v-else class="doto-text text-sm text-white-800 px-2 py-1">
        {{ props.toShow }}
      </div>
      <div class="align-middle block mr-2">
        <a v-if="href" target="blank" :href="props.href" class="underline"><slot></slot></a>
        <span v-else><slot></slot></span>
      </div>
    </div>
  </button>
</template>

<style scoped>
.tag {
  border-radius: 0.5rem;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  text-align: center;
}

.noClick {
  cursor: default;
}
</style>
