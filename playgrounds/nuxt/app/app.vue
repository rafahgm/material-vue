<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const { components, groups, items } = useNavigation()

useHead({
  title: 'Material Vue - Playground',
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
  <MApp :dir="appConfig.dir">
    <MNavigationRail
      fab-label="Pesquisar"
      :items="[{
        label: 'Get Started',
        icon: 'material-symbols:apps'
      }, {
        label: 'Components',
        icon: 'material-symbols:add-circle-outline-rounded'
      }, {
        label: 'Composables',
        icon: 'material-symbols:function-rounded'
      }]"
    />
  </MApp>
</template>
