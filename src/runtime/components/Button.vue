<script lang="ts">
import theme from '#build/ui/button'
import type { AppConfig } from '@nuxt/schema'
import type { ClassValue } from 'tailwind-variants'
import type { ComponentConfig } from '../types/tv'

type Button = ComponentConfig<typeof theme, AppConfig, 'button'>

export interface ButtonProps {
  label?: string
  class?: ClassValue
  ui?: Button['slots']
}

export interface ButtonSlots {
  default: () => any
}
</script>

<script setup lang="ts">
import { useAppConfig } from '#imports'
import { computed } from 'vue'
import { tv } from '../utils/tv'

const props = defineProps<ButtonProps>()
defineSlots<ButtonSlots>()

const appConfig = useAppConfig() as Button['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.button || {}) })())

function createRipple(elm: HTMLElement, event: Event) {
  const rect = elm.getBoundingClientRect()

  let x, y

  if ('clientX' in event && 'clientY' in event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
    x = event.clientX
    y = event.clientY
  } else {
    x = rect.width / 2
    y = rect.height / 2
  }

  const maxX = Math.max(x, rect.width - x)
  const maxY = Math.max(y, rect.height - y)
  const radius = Math.sqrt(maxX * maxX + maxY * maxY)
  const size = radius * 2

  // Cria a onda
  const wave = document.createElement('span')
  wave.className = 'ripple__wave'
  wave.style.backgroundColor = '#FF00FF'
}
</script>

<template>
  <button :class="theme.base({ class: [props.class, ui?.base] })">
    <slot>
      {{ label }}
    </slot>
  </button>
</template>
