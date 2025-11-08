const components = [
  'button'
].map(component => ({ label: upperName(component.split('/').pop() as string), icon: 'i-lucide-box', to: `/components/${component}` }))

export const useNavigation = () => {
  const appConfig = useAppConfig()

  const items = [{ label: 'Home', icon: 'i-lucide-home', to: '/' }, { label: 'Chat', icon: 'i-lucide-message-circle', to: '/chat' }]
  const groups = computed(() => [
    { id: 'links', items },
    { id: 'components', label: 'Components', items: components },
    {
      id: 'dir',
      label: 'Direction',
      items: [{
        label: 'LTR',
        icon: 'i-lucide-arrow-right',
        active: appConfig.dir === 'ltr',
        onSelect: () => appConfig.dir = 'ltr'
      }, {
        label: 'RTL',
        icon: 'i-lucide-arrow-left',
        active: appConfig.dir === 'rtl',
        onSelect: () => appConfig.dir = 'rtl'
      }]
    }
  ])

  return {
    components,
    groups,
    items
  }
}