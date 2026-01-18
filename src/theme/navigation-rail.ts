export default {
  slots: {
    base: 'bg-surface-container py-4 h-svh w-24 flex flex-col fixed left-0 z-100 transition-[width]',
    heading: 'mt-11 flex flex-col gap-5',
    menuButton: 'mx-5 w-min',
    fab: 'mx-5 w-min',
    itemsContainer: 'flex flex-col gap-1 mt-10',
    item: 'mb-1.5 h-14 flex flex-col gap-1 items-center group select-none text-on-surface-variant hover:cursor-pointer hover:text-secondary',
    itemIconContainer: 'px-4 py-1.5 rounded-full flex gap-2 items-center justify-center group-hover:bg-secondary-container transition-[padding] duration-150',
    itemIcon: 'shrink-0 size-6',
    itemExpandedText: 'text-sm',
    itemText: 'text-xs w-full'
  },
  variants: {
    expanded: {
      true: {
        base: 'w-55',
        item: 'w-fit ml-5',
        itemIconContainer: 'py-4'
      },
      false: {
        base: ''
      }
    }
  }
}
