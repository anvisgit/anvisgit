<script setup lang="ts">
import LabelTaggedComponent from '@/components/elements/LabelTagged.vue'
import { type Tech } from '@/types/objectData'

const props = defineProps<{
  title: string
  elements: Tech[]
}>()
</script>

<template>
  <div>
    <h3 class="">{{ props.title }}</h3>
    <div class="flex flex-col gap-1">
      <LabelTaggedComponent
        v-for="(element, index) in props.elements"
        :key="index"
        :href="element.url"
        :toShow="element.thumbnail"
        >{{ element.name }}
      </LabelTaggedComponent>
    </div>
  </div>
</template>

<style scoped>
.tech-stack h3 {
  margin-bottom: 0.25rem;
  font-weight: 900;
  font-size: 1.2rem;
}
</style>
