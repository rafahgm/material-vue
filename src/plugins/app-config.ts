import type { UnpluginOptions } from 'unplugin'
import type { MaterialVueOptions } from '../unplugin'

/**
 * This plugin injects Nuxt UI configuration into the runtime build so Nuxt UI components can
 * access it.
 */
export default function AppConfigPlugin(_options: MaterialVueOptions & { theme: NonNullable<MaterialVueOptions['theme']> }, appConfig: Record<string, any>) {
  return {
    name: 'material-vue-app-config',
    enforce: 'pre',
    resolveId(id) {
      if (id === '#build/app.config') {
        return 'virtual:material-vue-app-config'
      }
    },
    loadInclude: id => id === 'virtual:material-vue-app-config',
    load() {
      return `
          export default ${JSON.stringify(appConfig!)}
        `
    },
    vite: {
      // @ts-expect-error O tipo passado não bate com o esperado
      config() {
        return {
          test: {
            server: {
              deps: {
                inline: ['material-vue']
              }
            }
          }
        }
      }
    }
  } satisfies UnpluginOptions
}
