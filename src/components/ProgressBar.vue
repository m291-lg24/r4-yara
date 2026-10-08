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
    <div class="mb-3 flex items-center justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-primary">
          Content-Fortschritt
        </p>

        <p class="mt-1 text-xs text-zinc-500">
          Fast geschafft. Plane die letzten Inhalte.
        </p>
      </div>

      <span class="text-2xl font-bold text-primary">
        {{ value }} %
      </span>
    </div>

    <div
      class="h-3 w-full overflow-hidden rounded-full bg-zinc-200"
      role="progressbar"
      :aria-valuenow="value"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="h-full rounded-full bg-accent transition-[width] duration-300"
        :style="{ width: `${value}%` }"
      />
    </div>
  </div>
</template>