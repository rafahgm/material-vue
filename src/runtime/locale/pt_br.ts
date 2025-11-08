import { defineLocale } from '../composables/defineLocale'
import type { Messages } from '../types'

export default defineLocale<Messages>({
  name: 'Português',
  code: 'pt-br',
  messages: {
    alert: {
      close: 'Fechar'
    }
  }
})
