<script lang="ts">
import { reactivePick } from '@vueuse/core'
import type { ConfigProviderProps, TooltipProviderProps } from 'reka-ui'
import { localeContextInjectionKey } from '../composables/useLocale'
import { portalTargetInjectionKey } from '../composables/usePortal'
import type { Locale, Messages } from '../types/locale'

export interface AppProps<T extends Messages = Messages> extends Omit<ConfigProviderProps, 'useId' | 'dir' | 'locale'> {
  tooltip?: TooltipProviderProps
  locale?: Locale<T>
  portal?: boolean | string | HTMLElement
}

export interface AppSlots {
  default(props?: {}): any
}

export default {
  name: 'App'
}
</script>

<script setup lang="ts" generic="T extends Messages">
import { ConfigProvider, TooltipProvider, useForwardProps } from 'reka-ui'
import { provide, toRef, useId } from 'vue'

const props = withDefaults(defineProps<AppProps<T>>(), {
  portal: 'body'
})

defineSlots<AppSlots>()

const configProviderProps = useForwardProps(reactivePick(props, 'scrollBody'))
const tooltipProps = toRef(() => props.tooltip)

const locale = toRef(() => props.locale)
provide(localeContextInjectionKey, locale)

const portal = toRef(() => props.portal)
provide(portalTargetInjectionKey, portal)
</script>

<template>
  <ConfigProvider :use-id="() => (useId() as string)" :dir="locale?.dir" v-bind="configProviderProps">
    <TooltipProvider v-bind="tooltipProps">
      <slot />
      <OverlayProvider />
    </TooltipProvider>
  </ConfigProvider>
</template>
