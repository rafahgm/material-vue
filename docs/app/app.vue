<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <MApp :toaster="appConfig.toaster">
    <div class="dark">
      <ColorPalette title="Dark Scheme" />
    </div>
    <div class="light">
      <ColorPalette title="Light Scheme" />
    </div>
  </MApp>
</template>
