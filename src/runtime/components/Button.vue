<script lang="ts">
import theme from '#build/ui/button'
import type { AppConfig } from '@nuxt/schema'
import type { ClassValue } from 'tailwind-variants'
import type { ComponentConfig } from '../types/tv'
import type { UseComponentIconsProps } from '../composables/useComponentIcon'

type Button = ComponentConfig<typeof theme, AppConfig, 'button'>

export interface ButtonProps extends UseComponentIconsProps {
  label?: string
  class?: ClassValue
  ui?: Button['slots']

  /** Variants */
  color?: Button['variants']['color']
  size?: Button['variants']['size']
  variant?: Button['variants']['variant']
  shape?: Button['variants']['shape']
  square?: boolean
}

export interface ButtonSlots {
  leading(props: { ui: Button['ui'] }): any
  default(props: { ui: Button['ui'] }): any
}
</script>

<script setup lang="ts">
import { useAppConfig } from '#imports'
import { computed } from 'vue'
import { tv } from '../utils/tv'
import Icon from './Icon.vue'
import { useComponentIcons } from '../composables/useComponentIcon'

const props = defineProps<ButtonProps>()
const slots = defineSlots<ButtonSlots>()

const { isLeading, leadingIconName } = useComponentIcons(
  computed(() => ({ ...props }))
)

const appConfig = useAppConfig() as Button['AppConfig']

console.log(!!props.square || (!slots.default && !props.label), !!props.square, (!slots.default && !props.label))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.button || {}) })({
  size: props.size,
  shape: props.shape,
  variant: props.variant,
  color: props.color,
  square: !!props.square || (!slots.default && !props.label)
}))
</script>

<template>
  <button :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot name="leading" :ui="ui">
      <Icon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
    </slot>
    <slot :ui="ui">
      <span v-if="label !== undefined && label !== null" data-slot="label" :class="ui.label({ class: props.ui?.label })">
        {{ label }}
      </span>
    </slot>
  </button>
</template>
