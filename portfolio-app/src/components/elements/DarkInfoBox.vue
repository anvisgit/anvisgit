<template>
  <div class="dark-info-box">
    <slot name="title" />

    <slot name="text" />
    <slot />
  </div>
</template>

<style scoped>
.dark-info-box {
  background-color: rgba(0, 0, 0, 1);

  overflow: hidden;
}
</style>
