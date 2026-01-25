<script lang="ts">
import theme from '#build/ui/navigation-rail'
import type { ComponentConfig, IconProps, BadgeProps, ButtonProps, TooltipProps, LinkProps, LinkPropsKeys } from '../types'
import type { AppConfig } from '@nuxt/schema'
import type { ArrayOrNested, GetItemKeys, NestedItem } from '../types/utils'

type NavigationRail = ComponentConfig<typeof theme, AppConfig, 'navigationRail'>

export interface NavigationRailChildItem extends Omit<NavigationRailItem, 'type' | 'ui'> {
  [key: string]: any
}

export interface NavigationRailItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * Exibe um badge no item
   */
  badge?: string | number | BadgeProps
  /**
   * Exibe um tooltip no item
   */
  tooltip?: boolean | TooltipProps
  /**
   * O tipo do item
   * @defaultValue 'link'
   */
  type?: 'section-header' | 'trigger' | 'link'
  slot?: string
  /**
   * O valor do item
   * @defaultValue `item-${index}`
   */
  value?: string

  children?: NavigationRailChildItem[]
  onSelect?: (e: Event) => void
  class?: any
  ui?: Pick<NavigationRail['slots'], 'item' | 'icon' | 'label' | 'link' | 'activeIndicator'>
  [key: string]: any
}

type Orientation = NavigationRail['variants']['orientation']

export interface NavigationRailProps<
  T extends ArrayOrNested<NavigationRailItem> = ArrayOrNested<NavigationRailItem>,
  O extends Orientation = Orientation
> extends Pick<NavigationMenuRootProps, 'delayDuration' | 'disableClickTrigger' | 'disableHoverTrigger' | 'skipDelayDuration' | 'disablePointerLeaveClose' | 'unmountOnHide'> {
  /**
   * O elemento ou componente que o NavigationRail deve ser renderizado como
   * @defaultValue 'div'
   */
  as?: any

  /**
   * O valor controlado do item ativo
   * Use isso quando você precisar controlar o estado dos itens. Pode ser bindado com `v-model`
   */
  modelValue?: string

  /**
   * O valor padrão do item ativo
   * Use isso quando você não precisar controlar o estado dos itens.
   */
  defaultValue?: string

  items?: T

  /**
   * A orientação do NavigationRail
   * @defaultValue 'vertical'
   */
  orientation?: O

  /**
   * A chave utilizada para obter o valor dos itens
   * @defaultValue 'value'
   */
  valueKey?: GetItemKeys<T>

  /**
   * A chave utilizada para obter a label dos itens
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>

  /**
   * Props para o FAB do Navigation Rail
   * @defaultValue false
   */
  fab?: boolean | Omit<ButtonProps, LinkPropsKeys>

  /**
   * Props para o botão de expansão
   * @defaultValue false
   */
  toggle?: boolean | Omit<ButtonProps, LinkPropsKeys>

  /**
   * Define se a Navigation Rail deve estar expandida por padrão
   * @defaultValue false
   */
  defaultExpanded?: boolean
  class?: any
  ui?: NavigationRail['ui']
}

type SlotProps<T extends NavigationRailItem> = (props: { item: T, index: number, active?: boolean, ui: NavigationRail['ui'] }) => any

export interface NavigationRailSlots<
  A extends ArrayOrNested<NavigationRailItem> = ArrayOrNested<NavigationRailItem>,
  T extends NestedItem<A> = NestedItem<A>
> {
  'item': SlotProps<T>
  'item-icon': SlotProps<T>
  'item-label': (props: { item: T, index: number, active?: boolean }) => any
  'item-label-expaneded': (props: { item: T, index: number, active?: boolean }) => any
  'item-content': SlotProps<T> & { close?: () => void }
  'list-leading': (props?: {}) => any
  'list-trailing': (props?: {}) => any
}

export interface NavigationRailEmits {
  /**
   * Event handler chamado quando o valor muda.
   */
  'update:modelValue': [value: string | undefined]
}
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<NavigationRailItem>, O extends Orientation = Orientation">
import { useForwardPropsEmits, NavigationMenuRoot, type NavigationMenuRootProps, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from 'reka-ui'
import { isArrayOfArray, get } from '../utils'
import { pickLinkProps } from '../utils/link'
import { createReusableTemplate, useElementSize } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'
import { tv } from '../utils/tv'
import { useAppConfig } from '#imports'
import { motion } from 'motion-v'
import Button from './Button.vue'
import LinkBase from './LinkBase.vue'
import Link from './Link.vue'

const props = withDefaults(defineProps<NavigationRailProps<T, O>>(), {
  orientation: 'vertical' as never,
  delayDuration: 0,
  unmountOnHide: true,
  valueKey: 'value',
  labelKey: 'label'
})
const emits = defineEmits<NavigationRailEmits>()
defineSlots<NavigationRailSlots>()

const appConfig = useAppConfig() as NavigationRail['AppConfig']

const rootProps = useForwardPropsEmits(computed(() => ({
  as: props.as,
  modelValue: props.modelValue,
  defaultValue: props.defaultValue,
  delayDuration: props.delayDuration,
  skipDelayDuration: props.skipDelayDuration,
  orientation: props.orientation,
  disableClickTrigger: props.disableClickTrigger,
  disableHoverTrigger: props.disableHoverTrigger,
  disablePointerLeaveClose: props.disablePointerLeaveClose,
  unmountOnHide: props.unmountOnHide
})), emits)

const expanded = defineModel<boolean>('expanded', {
  default: props => props.defaultExpanded ?? false
})

const MotionNavigationMenuRoot = motion.create(NavigationMenuRoot)

const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate<{ item: NavigationRailItem, index: number, active?: boolean }>()
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: NavigationRailItem, index: number, level?: number }>({
  props: {
    item: Object,
    index: Number,
    level: Number
  }
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.navigationRail || {}) })({
  orientation: props.orientation,
  expanded: expanded.value
}))

// Animação de expansão
const content = useTemplateRef('content')
const { width: contentWidth } = useElementSize(content)

const expandedWidth = computed(() => {
  const raw = contentWidth.value || 0
  return Math.min(360, Math.max(220, raw))
})

const rootAnimate = computed(() => ({
  width: expanded.value ? expandedWidth.value : 96
}))

const rootMotionTransition = {
  type: 'spring',
  bounce: 0.2,
  duration: 0.35
} as const

function toggleExpanded() {
  expanded.value = !expanded.value
}

const lists = computed<NavigationRailItem[][]>(() =>
  props.items?.length
    ? isArrayOfArray(props.items)
      ? props.items
      : [props.items]
    : []
)
</script>

<template>
  <DefineLinkTemplate v-slot="{ item, active, index }">
    <slot :name="((item.slot || 'item') as keyof NavigationRailSlots<T>)" :item="item" :index="index" :active="active" :ui="ui">
      <div v-if="item.type !== 'section-header'" :class="ui?.activeIndicator({ class: [props.ui?.activeIndicator, item.ui?.activeIndicator], active, disabled: !!item.disabled })" />
      <slot :name="((item.slot ? `${item.slot}-icon` : 'item-icon') as keyof NavigationRailSlots<T>)" :item="item" :active="active" :index="index" :ui="ui">
        <Icon v-if="item.type !== 'section-header'" data-slot="itemIcon" :name="item.icon ?? appConfig.ui.icons.navigationRailDefault" :class="ui.icon({ class: [props.ui?.icon, item.ui?.icon], active, disabled: !!item.disabled })" />
      </slot>
      <span data-slot="itemLabel" :class="ui.label({ class: [props.ui?.label, item.ui?.label], active, disabled: !!item.disabled, sectionHeader: item.type === 'section-header' })">
        <slot :name="((item.slot ? `${item.slot}-label` : 'item-label') as keyof NavigationRailSlots<T>)" :item="item" :active="active" :index="index" :ui="ui">
          {{ get(item, props.labelKey as string) }}
        </slot>
      </span>
    </slot>
  </DefineLinkTemplate>

  <DefineItemTemplate v-slot="{ item, index }">
    <component
      :is="NavigationMenuItem"
      as="li"
      :value="get(item, props.valueKey as string) ?? `item-${index}`"
    >
      <div v-if="item.type === 'section-header'" data-slot="label" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class] })">
        <ReuseLinkTemplate :item="item" :index="index" />
      </div>
      <Link v-else v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item as Omit<NavigationRailItem, 'type'>)" custom>
        <component :is="NavigationMenuLink" as-child :active="active || item.active" :disabled="item.disabled" @select="item.onSelect">
          <LinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled })">
            <ReuseLinkTemplate :item="item" :active="active || item.active" :index="index" />
          </LinkBase>
        </component>
      </Link>
    </component>
  </DefineItemTemplate>

  <MotionNavigationMenuRoot
    v-bind="rootProps"
    :data-expanded="expanded"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :transition="rootMotionTransition"
    :animate="rootAnimate"
  >
    <div ref="content" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div :class="ui.heading({ class: props.ui?.heading })">
        <Button
          v-if="toggle"
          v-bind="(typeof toggle === 'object' ? toggle : {})"
          :class="ui.toggle({ class: props.ui?.toggle })"
          shape="square"
          variant="ghost"
          :icon="expanded ? 'material-symbols:menu-open' : 'material-symbols:menu'"
          @click="() => toggleExpanded()"
        />

        <Button
          v-if="fab"
          v-bind="(typeof fab === 'object' ? { ...fab, label: undefined } : {})"
          :class="ui.fab({ class: props.ui?.fab })"
          shape="square"
          square
          icon="material-symbols:search"
        >
          <template v-if="expanded && typeof fab === 'object' && fab.label">
            {{ fab.label }}
          </template>
        </Button>
      </div>

      <template v-for="(list, listIndex) in lists" :key="`list-${listIndex}`">
        <component
          :is="NavigationMenuList"
          :model-value="modelValue"
          :default-value="defaultValue"
          as="ul"
          data-slot="list"
          :class="ui.list({ class: props.ui?.list })"
        >
          <ReuseItemTemplate
            v-for="(item, itemIndex) in list"
            :key="`list-${listIndex}-${itemIndex}`"
            :item="item"
            :index="itemIndex"
            data-slot="item"
            :class="ui.item({ class: [props.ui?.item, item.ui?.item] })"
          />
        </component>
      </template>
    </div>
  </MotionNavigationMenuRoot>
</template>
