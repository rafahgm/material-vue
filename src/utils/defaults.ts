import type { ModuleOptions } from '../module'
import icons from '../theme/icons'

export function resolveColors(colors?: string[]) {
  return colors?.length
    ? [...new Set(['primary', ...colors])]
    : ['primary', 'secondary', 'success', 'info', 'warning', 'error']
}

export function getDefaultConfig(theme?: ModuleOptions['theme']) {
  return {
    icons,
    prefix: theme?.prefix,
    tv: {
      twMergeConfig: {
        prefix: theme?.prefix
      }
    }
  }
}

export const defaultOptions = {
  prefix: 'M',
  fonts: true,
  colorMode: true,
  theme: {
    transitions: true,
    defaultVariants: {
      color: undefined,
      size: undefined
    },
    prefix: undefined
  },
  mdc: false,
  content: false
}
