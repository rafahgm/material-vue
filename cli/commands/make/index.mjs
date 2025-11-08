import { defineCommand } from 'citty'
import component from './component.mjs'
import locale from './locale.mjs'

export default defineCommand({
  meta: {
    name: 'make',
    description: 'Commands to create new VM3 entities.'
  },
  subCommands: {
    component,
    locale
  }
})
