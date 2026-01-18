<script lang="ts">
import theme from '#build/ui/navigation-rail'
import type { ComponentConfig } from '../types'
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps } from './Button.vue'

type NavigationRail = ComponentConfig<typeof theme, AppConfig, 'navigationRail'>
export interface NavigationRailProps {
  /**
   * Os itens do Navigation Rail
   */
  items: any[]

  /**
   * Label do FAB
   */
  fabLabel?: string

  /**
   * FAB do Navigation Rail
   */
  fab?: boolean | ButtonProps

  /**
   * Define se a Navigation Rail deve estar expandida por padrão
   * @defaultValue false
   */
  defaultExpanded?: boolean
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

const expanded = defineModel<boolean>('expanded', {
  default: props => props.defaultExpanded ?? false
})

const appConfig = useAppConfig() as NavigationRail['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.navigationRail || {}) })({
  expanded: expanded.value
}))

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
      <slot name="heading" :ui="ui">
        <div :class="ui.heading({ class: props.ui?.heading })">
          <Button :class="ui.menuButton({ class: props.ui?.menuButton })" shape="square" variant="ghost" :icon="expanded ? 'material-symbols:menu-open' : 'material-symbols:menu'" @click="expanded = !expanded" />

          <Button
            v-if="fab || fabLabel"
            v-bind="(typeof fab === 'object' ? fab : {})"
            :class="ui.fab({ class: props.ui?.fab })"
            shape="square"
            square
            icon="material-symbols:search"
            @click="open = !open"
          >
            <template v-if="expanded">
              {{ fabLabel }}
            </template>
          </Button>
        </div>
      </slot>
      <div :class="ui.itemsContainer({ class: props.ui?.itemsContainer })">
        <slot :ui="ui">
          <div v-for="(item, index) in items" :key="index" :class="ui.item({ class: props.ui?.item })">
            <div :class="ui.itemIconContainer({ class: props.ui?.itemIconContainer })">
              <Icon :class="ui.itemIcon({ class: props.ui?.itemIcon })" :name="item.icon" />
              <span v-if="expanded" :class="ui.itemExpandedText({ class: props.ui?.itemExpandedText })">{{ item.label }}</span>
            </div>
            <span v-if="!expanded" :class="ui.itemText({ class: props.ui?.itemText })">{{ item.label }}</span>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
