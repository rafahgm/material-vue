<script setup lang="ts">
import type { NuxtError } from '#app'

const { components, groups, items } = useNavigation()

defineProps<{
  error: NuxtError
}>()

provide('components', components)
</script>

<template>
  <MApp>
    <MError :error="error" />
  </MApp>
</template>
