import { defineNuxtPlugin, useHead, useNuxtApp } from '#imports'
import { ColorRoles, DynamicScheme, Hct, Variant, hexFromArgb } from '@rafahgm/material-color-utilities'
import type { UseHeadInput } from '@unhead/vue/types'
import { kebabCase } from 'scule'
import { computed } from 'vue'

export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()

  const lightScheme = new DynamicScheme({ sourceColorHct: Hct.from(351.8516475826425, 27.9304793225941, 82.35788838667906), variant: Variant.EXPRESSIVE, isDark: false, contrastLevel: 0, specVersion: '2025' })
  const darkScheme = new DynamicScheme({ sourceColorHct: Hct.from(351.8516475826425, 27.9304793225941, 82.35788838667906), variant: Variant.EXPRESSIVE, isDark: true, contrastLevel: 0, specVersion: '2025' })

  const root = computed(() => `@layer theme {
  :root, :host, .light {
    ${ColorRoles.map(colorRole => `--ui-color-${kebabCase(colorRole)}: ${hexFromArgb(lightScheme[colorRole])};`).join('\n')}
  }

  .dark {
    ${ColorRoles.map(colorRole => `--ui-color-${kebabCase(colorRole)}: ${hexFromArgb(darkScheme[colorRole])};`).join('\n')}
  }
}`)

  // Head
  const headData: UseHeadInput = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2,
      id: 'material-vue-colors'
    }]
  }

  // SPA mode
  if (import.meta.client && nuxtApp.isHydrating && !nuxtApp.payload.serverRendered) {
    const style = document.createElement('style')

    style.innerHTML = root.value
    style.setAttribute('data-material-vue-colors', '')
    document.head.appendChild(style)

    headData.script = [{
      innerHTML: 'document.head.removeChild(document.querySelector(\'[data-material-vue-colors]\'))'
    }]
  }

  useHead(headData)
})
