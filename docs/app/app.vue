<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <MApp :toaster="appConfig.toaster">
    <MNavigationRail />
  </MApp>
</template>
