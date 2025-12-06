<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="flex flex-col gap-10 border-outline border rounded bg-surface p-10">
    <span class="text-on-surface font-semibold text-xl">{{ title }}</span>
    <div class="flex flex-col gap-5 lg:flex-row">
      <div class="flex flex-col gap-5">
        <div class="flex flex-col md:grid md:grid-cols-[1fr_1fr_1fr] gap-y-5 gap-x-2">
          <PrimarySwatches />
          <SecondarySwatches />
          <TertiarySwatches />

          <PrimaryFixedSwatches />
          <SecondaryFixedSwatches />
          <TertiaryFixedSwatches />
        </div>
        <SurfaceSwatches />
      </div>
      <div class="flex flex-col grow">
        <ErrorSwatches />

        <div class="mt-auto flex flex-col">
          <ColorSwatch class="bg-inverse-surface text-surface" name="Inverse Surface" />
          <ColorSwatch class="bg-inverse-on-surface text-on-surface" name="Inverse On Surface" half-height />
          <ColorSwatch class="bg-inverse-primary text-primary" name="Inverse Primary" half-height />
          <div class="flex gap-x-5 mt-8">
            <ColorSwatch class="bg-scrim text-white" name="Scrim" half-height />
            <ColorSwatch class="bg-shadow text-white" name="Shadow" half-height />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
