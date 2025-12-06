#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import make from './commands/make/index.mjs'

const main = defineCommand({
  meta: {
    name: 'material-vue',
    description: 'Material Vue CLI'
  },
  subCommands: {
    make
  }
})

runMain(main)
