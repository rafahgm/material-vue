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
      :default-value="'item-0'"
      toggle
      :fab="{
        label: 'Pesquisar'
      }"
      :items="[{ type: 'section-header',
                 label: 'Componentes',
                 children: [{
                   label: 'Get Started',
                   icon: 'material-symbols:apps',
                   active: true
                 }, {
                   label: 'Components',
                   icon: 'material-symbols:add-circle-outline-rounded'
                 }, {
                   label: 'Composables',
                   icon: 'material-symbols:function-rounded'
                 }] }]"
    />
  </MApp>
</template>
