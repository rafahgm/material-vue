<template>
  <div class="grid grid-cols-[1fr_1fr_1fr] gap-y-2">
    <ColorSwatch class="bg-surface-dim text-on-surface" name="Surface Dim" />
    <ColorSwatch class="bg-surface text-on-surface" name="Surface" />
    <ColorSwatch class="bg-surface-bright text-on-surface" name="Surface Bright" />
    <div class="flex flex-col md:flex-row col-span-[3]">
      <ColorSwatch class="bg-surface-container-lowest text-on-surface h-24" name="Surface Container Lowest" />
      <ColorSwatch class="bg-surface-container-low text-on-surface  h-24" name="Surface Container Low" />
      <ColorSwatch class="bg-surface-container text-on-surface  h-24" name="Surface Container" />
      <ColorSwatch class="bg-surface-container-high text-on-surface  h-24" name="Surface Container High" />
      <ColorSwatch class="bg-surface-container-highest text-on-surface  h-24" name="Surface Container Highest" />
    </div>
    <div class="flex  flex-col md:flex-row col-span-[3]">
      <ColorSwatch class="bg-on-surface text-surface" name="On Surface" half-height />
      <ColorSwatch class="bg-on-surface-variant text-surface" name="On Surface Variant" half-height />
      <ColorSwatch class="bg-outline text-on-surface" name="Outline" half-height />
      <ColorSwatch class="bg-outline-variant text-on-surface" name="Outline Variant" half-height />
    </div>
  </div>
</template>
