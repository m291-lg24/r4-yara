<script setup>
const props = defineProps({
  value: { type: Number, required: true },
  label: { type: String, default: 'Content-Fortschritt' },
})
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between gap-4">
      <p class="text-sm font-semibold text-primary">{{ label }}</p>
      <span class="text-lg font-bold text-primary">{{ Math.max(0, Math.min(100, value)) }} %</span>
    </div>

    <div
      class="h-3 w-full overflow-hidden rounded-full bg-zinc-200"
      role="progressbar"
      :aria-label="label"
      :aria-valuenow="value"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="h-full rounded-full bg-accent transition-[width] duration-300"
        :style="{ width: `${Math.max(0, Math.min(100, value))}%` }"
      />
    </div>
  </div>
</template>
