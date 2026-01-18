export default {
  slots: {
    base: 'inline-flex items-center hover:cursor-pointer',
    label: 'truncate',
    leadingIcon: 'shrink-0'
  },
  variants: {
    size: {
      xs: {},
      sm: {},
      md: {
        base: 'text-base py-4 px-6 gap-2',
        leadingIcon: 'size-6'
      },
      lg: {},
      xl: {}
    },
    color: {
      primary: 'bg-primary text-on-primary'
    },
    shape: {
      round: 'rounded-full',
      square: 'rounded-2xl'
    },
    square: {
      true: ''
    },
    variant: {
      elevated: '',
      filed: '',
      tonal: '',
      outlined: '',
      text: '',
      ghost: 'text-primary bg-transparent hover:bg-on-surface-variant/10'
    }
  },
  compoundVariants: [
    {
      square: true,
      size: 'xs',
      class: ''
    },
    {
      square: true,
      size: 'sm',
      class: ''
    },
    {
      square: true,
      size: 'md',
      class: 'p-4'
    },
    {
      square: true,
      size: 'lg',
      class: ''
    },
    {
      square: true,
      size: 'xl',
      class: ''
    }
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    shape: 'round',
    variant: 'filled'
  }
}
