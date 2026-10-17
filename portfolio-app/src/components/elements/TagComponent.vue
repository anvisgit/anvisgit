<script setup lang="ts">
const props = defineProps<{
  toShow: string
  onClick?: () => void
}>()
</script>

<template>
  <button class="h-full" @click="props.onClick" :class="props.onClick ? '' : 'noClick'">
    <div class="h-full" v-if="props.toShow.split('.').length > 1">
      <img class="w-auto h-full min-h-6 rounded-md bg-white" :src="`tags/${props.toShow}`" alt="" />
    </div>
    <div v-else class="tag h-full min-h-6 flex justify-center items-center">
      <div class="m-auto doto-text text-sm text-white-800 mx-3">{{ props.toShow }}</div>
    </div>
  </button>
</template>

<style scoped>
.tag {
  border-radius: 0.5rem;
  border-width: 2px;
  color: rgb(255 255 255 / 1);
  text-align: center;
}
.pad {
  padding: 10% 10% 10% 10%;
}

.round {
  border-radius: 0.5rem;
  border-width: 2px;
}

.noClick {
  cursor: default;
}
</style>
