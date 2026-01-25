export default {
  slots: {
    root: 'bg-surface-container py-4 h-svh flex flex-col fixed left-0 z-100 overflow-hidden',
    wrapper: 'w-max min-w-55 max-w-90',
    heading: 'mt-11 flex flex-col gap-5',
    toggle: 'mx-5 w-min',
    fab: 'mx-5 w-min',
    list: 'flex flex-col gap-2 mt-10',
    item: 'w-24 flex flex-col items-center relative',
    activeIndicator: 'w-14 h-9 rounded-2xl absolute top-0 left-5  -z-1 transition-[height,width,border-radius]',
    link: 'group flex flex-col gap-1 items-center group select-none text-on-surface-variant overflow-hidden hover:cursor-pointer hover:text-secondary',
    icon: 'text-on-surface-variant shrink-0 size-6 my-1.5 transition-[margin]',
    label: 'text-on-surface-variant text-xs text-center whitespace-nowrap truncate'
  },
  variants: {
    sectionHeader: {
      true: {
        label: 'text-sm'
      }
    },
    orientation: {
      vertical: '',
      horizontal: ''
    },
    active: {
      true: {
        activeIndicator: 'bg-secondary-container',
        icon: 'text-on-secondary-container',
        label: 'text-on-secondary-container'
      },
      false: ''
    },
    expanded: {
      true: {
        item: 'w-fit ml-5',
        activeIndicator: 'h-14 left-0 w-full translate-none rounded-4xl',
        link: 'flex-row px-4',
        icon: 'my-4',
        label: 'text-sm'
      }
    }
  }
}
