<script lang="ts">
import theme from '#build/ui/navigation-rail'
import type { ComponentConfig } from '../types'
import type { AppConfig } from '@nuxt/schema'

type NavigationRail = ComponentConfig<typeof theme, AppConfig, 'navigationRail'>
export interface NavigationRailProps {
  class?: any
  ui?: NavigationRail['ui']
}

export interface NavigationRailSlots {
  heading(props: { ui: NavigationRail['ui'] }): any
  default(props: { ui: NavigationRail['ui'] }): any
}

export interface NavigationRailEmits {

}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { tv } from '../utils/tv'
import { useAppConfig } from '#imports'
import Button from './Button.vue'
import Slideover from './Slideover.vue'

const props = defineProps<NavigationRailProps>()
defineSlots<NavigationRailSlots>()
defineEmits<NavigationRailEmits>()

const appConfig = useAppConfig() as NavigationRail['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.navigationRail || {}) })())

const open = ref(false)
</script>

<template>
  <div>
    <Slideover
      v-model:open="open"
      side="left"
      class="left-22 w-60 rounded-r-2xl z-0"
      :portal="false"
      :overlay="false"
      :modal="false"
      :dismissible="false"
    >
      <template #content>
        <div class="p-2 flex flex-col">
          <Button label="Components Overview" />
        </div>
      </template>
    </Slideover>
    <div :class="ui.base({ class: [props.ui?.base, props.class] })">
      <div class="mb-6">
        <slot name="heading" :ui="ui">
          <Button shape="square" icon="material-symbols:search" @click="open = !open" />
        </slot>
      </div>
      <div class="flex flex-col gap-4">
        <slot :ui="ui">
          <div class="flex flex-col gap-0.5 items-center group select-none text-on-surface-variant hover:cursor-pointer hover:text-on-surface">
            <div class="px-4 py-1 rounded-full flex items-center justify-center group-hover:bg-on-surface-variant/10">
              <Icon class="shrink-0 size-6" name="material-symbols:apps" />
            </div>
            <span class="text-xs">Get Started</span>
          </div>
          <div class="flex flex-col gap-0.5 items-center group select-none text-on-surface-variant hover:cursor-pointer hover:text-on-surface">
            <div class="px-4 py-1 rounded-full flex items-center justify-center group-hover:bg-on-surface-variant/10">
              <Icon class="shrink-0 size-6" name="material-symbols:add-circle-outline-rounded" />
            </div>
            <span class="text-xs">Componentes</span>
          </div>
          <div class="flex flex-col gap-0.5 items-center group select-none text-on-surface-variant hover:cursor-pointer hover:text-on-surface">
            <div class="px-4 py-1 rounded-full flex items-center justify-center group-hover:bg-on-surface-variant/10">
              <Icon class="shrink-0 size-6" name="material-symbols:function-rounded" />
            </div>
            <span class="text-xs">Composables</span>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
