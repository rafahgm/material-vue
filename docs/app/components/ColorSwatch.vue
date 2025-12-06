<script lang="ts">
export interface ColorSwatchProps {
  name: string
  halfHeight?: boolean
  class?: any
}
</script>

<script setup lang="ts">
const props = defineProps<ColorSwatchProps>()
</script>

<template>
  <div :class="[{ 'h-20': !halfHeight, 'h-10': halfHeight }, 'w-full p-2', props.class]">
    {{ name }}
  </div>
</template>
