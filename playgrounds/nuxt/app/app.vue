<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const { components, groups, items } = useNavigation()

useHead({
  title: 'VM3 UI - Playground',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Explore and test all Nuxt UI components in an interactive environment' }
  ],
  htmlAttrs: {
    lang: 'en',
    dir: computed(() => appConfig.dir as 'ltr' | 'rtl')
  }
})

provide('components', components)
</script>

<template>
  <App :dir="appConfig.dir" />
</template>
