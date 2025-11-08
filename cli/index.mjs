#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import make from './commands/make/index.mjs'

const main = defineCommand({
  meta: {
    name: 'vm3',
    description: 'VM3 CLI'
  },
  subCommands: {
    make
  }
})

runMain(main)
