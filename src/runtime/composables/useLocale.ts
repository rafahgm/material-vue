import { createSharedComposable } from '@vueuse/core'
import type { InjectionKey, Ref } from 'vue'
import { computed, inject, toRef } from 'vue'
import ptBR from '../locale/pt_br'
import type { Locale, Messages } from '../types/locale'
import { buildLocaleContext } from '../utils/locale'

export const localeContextInjectionKey: InjectionKey<Ref<Locale<unknown> | undefined>> = Symbol.for('nuxt-ui.locale-context')

const _useLocale = (localeOverrides?: Ref<Locale<Messages> | undefined>) => {
  const locale = localeOverrides || toRef(inject<Locale<Messages>>(localeContextInjectionKey, ptBR))

  return buildLocaleContext<Messages>(computed(() => locale.value || ptBR))
}

export const useLocale = /* @__PURE__ */ import.meta.client ? createSharedComposable(_useLocale) : _useLocale
