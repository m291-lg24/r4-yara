<script setup>
defineProps({
  value: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <span class="text-sm font-medium text-zinc-600">
        Content-Fortschritt
      </span>

      <span class="text-xl font-bold text-primary">
        {{ value }} %
      </span>
    </div>

    <div
      class="h-3 overflow-hidden rounded-full bg-zinc-200"
      role="progressbar"
      :aria-valuenow="value"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="h-full rounded-full bg-accent transition-all duration-300"
        :style="{ width: `${value}%` }"
      />
    </div>
  </div>
</template>