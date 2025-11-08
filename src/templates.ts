import { addTemplate, addTypeTemplate, logger, updateTemplates, type Resolver } from '@nuxt/kit'
import { genExport } from 'knitwork'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { Nuxt, NuxtTemplate, NuxtTypeTemplate } from 'nuxt/schema'
import { join } from 'pathe'
import { camelCase, kebabCase, pascalCase } from 'scule'
import { globSync } from 'tinyglobby'
import type { ModuleOptions } from './module'
import * as theme from './theme'

type DependencyGraph = Map<string, Set<string>>

async function buildComponentDependencyGraph(componentDir: string, componentPattern: RegExp): Promise<DependencyGraph> {
  const dependencyGraph = new Map<string, Set<string>>()

  const componentFiles = globSync(['**/*.vue'], {
    cwd: componentDir,
    absolute: true
  })

  for (const componentFile of componentFiles) {
    try {
      const content = await readFile(componentFile, 'utf-8')
      const componentName = pascalCase(componentFile.split('/').pop()!.replace('.vue', ''))
      const dependencies = new Set<string>()

      const matches = content.matchAll(componentPattern)
      for (const match of matches) {
        const depName = match[1] || match[2]
        if (depName && depName !== componentName) {
          dependencies.add(depName)
        }
      }

      dependencyGraph.set(componentName, dependencies)
    } catch {
      // Ignroe files that cant be read
    }
  }

  return dependencyGraph
}

function resolveComponentDependencies(
  component: string,
  dependencyGraph: DependencyGraph,
  resolved: Set<string> = new Set()
): Set<string> {
  if (resolved.has(component)) {
    return resolved
  }

  resolved.add(component)

  const dependencies = dependencyGraph.get(component)

  if (dependencies) {
    for (const dep of dependencies) {
      resolveComponentDependencies(dep, dependencyGraph, resolved)
    }
  }

  return resolved
}

async function detectUsedComponents(
  rootDir: string,
  prefix: string,
  componentDir: string,
  includeComponents?: string[]
): Promise<Set<string> | undefined> {
  const detectedComponents = new Set<string>()

  if (includeComponents && includeComponents.length > 0) {
    for (const component of includeComponents) {
      detectedComponents.add(component)
    }
  }

  const appFiles = globSync(['**/*.{vue,ts,js,tsx,jsx}'], {
    cwd: rootDir,
    ignore: ['node_modules/**', '.nuxt/**', 'dist/**']
  })

  const componentPattern = new RegExp(`<(?:Lazy)?${prefix}([A-Z][a-zA-Z]+)|\\b(?:Lazy)?${prefix}([A-Z][a-zA-Z]+)\\b`, 'g')

  for (const file of appFiles) {
    try {
      const filePath = join(rootDir, file)
      const content = await readFile(filePath, 'utf-8')
      const matches = content.matchAll(componentPattern)

      for (const match of matches) {
        const componentName = match[1] || match[2]
        if (componentName) {
          detectedComponents.add(componentName)
        }
      }
    } catch {
      // Ignore files that cant be read
    }
  }

  if (detectedComponents.size === 0) {
    return undefined
  }

  const dependencyGraph = await buildComponentDependencyGraph(componentDir, componentPattern)

  const allComponents = new Set<string>()
  for (const component of detectedComponents) {
    const resolved = resolveComponentDependencies(component, dependencyGraph)
    for (const resolvedComponent of resolved) {
      allComponents.add(resolvedComponent)
    }
  }

  return allComponents
}

export function getTemplates(options: ModuleOptions, uiConfig: Record<string, any>, nuxt?: Nuxt, resolve?: Resolver['resolve']) {
  const templates: NuxtTemplate[] = []

  let previousDetectedComponents: Set<string> | undefined

  const isDev = process.argv.includes('--uiDev')

  function writeThemeTemplate(theme: Record<string, any>, path?: string) {
    for (const component in theme) {
      templates.push({
        filename: `ui/${path ? `${path}/` : ''}${kebabCase(component)}.ts`,
        write: true,
        getContents: async () => {
          const template = (theme as any)[component]
          const result = typeof template === 'function' ? template(options) : template

          // Override default variants from nuxt.config.ts
          if (result?.defaultVariants?.size && options.theme?.defaultVariants?.size) {
            result.defaultVariants.size = options.theme.defaultVariants.size
          }

          const variants = Object.entries(result.variants || {})
            .filter(([_, values]) => {
              const keys = Object.keys(values as Record<string, unknown>)
              return keys.some(key => key !== 'true' && key !== 'false')
            })
            .map(([key]) => key)

          let json = JSON.stringify(result, null, 2)

          for (const variant of variants) {
            json = json.replace(new RegExp(`("${variant}": "[^"]+")`, 'g'), `$1 as typeof ${variant}[number]`)
            json = json.replace(new RegExp(`("${variant}": \\[\\s*)((?:"[^"]+",?\\s*)+)(\\])`, 'g'), (_, before, match, after) => {
              const replaced = match.replace(/("[^"]+")/g, `$1 as typeof ${variant}[number]`)
              return `${before}${replaced}${after}`
            })
          }

          function generateVariantDeclarations(variants: string[]) {
            return variants.filter(variant => json.includes(`as typeof ${variant}`)).map((variant) => {
              const keys = Object.keys(result.variants[variant])
              return `const ${variant} = ${JSON.stringify(keys, null, 2)} as const`
            })
          }

          // For local development, import directly from theme
          if (isDev) {
            const templatePath = fileURLToPath(new URL(`./theme/${path ? `${path}/` : ''}${kebabCase(component)}`, import.meta.url))
            return [
              `import template from ${JSON.stringify(templatePath)}`,
              ...generateVariantDeclarations(variants),
              `const options = ${JSON.stringify(options, null, 2)}`,
              `const result = typeof template === 'function' ? (template as Function)(options) : template`,
              `if (result?.defaultVariants?.color && options.theme?.defaultVariants?.color) result.defaultVariants.color = options.theme.defaultVariants.color`,
              `if (result?.defaultVariants?.size && options.theme?.defaultVariants?.size) result.defaultVariants.size = options.theme.defaultVariants.size`,
              `const theme = ${json}`,
              `export default result as typeof theme`
            ].join('\n\n')
          }

          // For production build
          return [
            ...generateVariantDeclarations(variants),
            `export default ${json}`
          ].join('\n\n')
        }
      })
    }
  }

  async function _getSources() {
    let sources = ''

    if (!!nuxt && !!resolve && options.experimental?.componentDetection) {
      const detectedComponents = await detectUsedComponents(
        nuxt.options.rootDir,
        options.prefix!,
        resolve!('./runtime/components'),
        Array.isArray(options.experimental.componentDetection) ? options.experimental.componentDetection : undefined
      )

      if (detectedComponents && detectedComponents.size > 0) {
        if (previousDetectedComponents) {
          const newComponents = Array.from(detectedComponents).filter(
            component => !previousDetectedComponents!.has(component)
          )
          if (newComponents.length > 0) {
            logger.success(`VM3 detected new components: ${newComponents.join(', ')}`)
          }
        } else {
          logger.success(`VM3 detected ${detectedComponents.size} components in use (including dependencies)`)
        }

        previousDetectedComponents = detectedComponents

        const sourcesList: string[] = []

        for (const component of detectedComponents) {
          const kebabComponent = kebabCase(component)
          const camelComponent = camelCase(component)

          if ((theme as any)[camelComponent]) {
            sourcesList.push(`@source "./ui/${kebabComponent}.ts";`)
          }
        }

        sources = sourcesList.join('\n')
      } else {
        if (!previousDetectedComponents || previousDetectedComponents.size > 0) {
          logger.info('VM3 detected no components in use, including all components')
        }
        previousDetectedComponents = new Set()
      }
    }

    return sources || '@source "./ui";'
  }

  writeThemeTemplate(theme)

  templates.push({
    filename: 'ui/index.ts',
    write: true,
    getContents: () => {
      return Object.keys(theme).map(component => `export { default as ${component} } from './${kebabCase(component)}'`).join('\n')
    }
  })

  templates.push({
    filename: 'ui-image-component.ts',
    write: true,
    getContents: ({ app }) => {
      const image = app?.components?.find(c => c.pascalName === 'NuxtImg' && !/nuxt(?:-nightly)?\/dist\/app/.test(c.filePath))

      return image ? genExport(image.filePath, [{ name: image.export, as: 'default' }]) : 'export default "img"'
    }
  })

  return templates
}

export function addTemplates(options: ModuleOptions, nuxt: Nuxt, resolve: Resolver['resolve']) {
  const templates = getTemplates(options, nuxt.options.appConfig.ui, nuxt, resolve)
  for (const template of templates) {
    if (template.filename!.endsWith('.d.ts')) {
      addTypeTemplate(template as NuxtTypeTemplate)
    } else {
      addTemplate(template)
    }
  }

  nuxt.hook('prepare:types', ({ references }) => {
    references.push({ path: resolve('./runtime/types/app.config.d.ts') })
  })

  if (options.experimental?.componentDetection && nuxt.options.dev) {
    nuxt.hook('builder:watch', async (_, path) => {
      if (/\.(?:vue|ts|js|tsx|jsx)$/.test(path)) {
        await updateTemplates({ filter: template => template.filename === 'ui.css' })
      }
    })
  }
}
