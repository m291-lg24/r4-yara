<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
})

const statusClass = computed(() => {
  const classes = {
    Offen: 'bg-zinc-100 text-zinc-700',
    'In Arbeit': 'bg-blue-100 text-blue-800',
    Geplant: 'bg-violet-100 text-violet-800',
    Erledigt: 'bg-green-100 text-green-800',
    Überfällig: 'bg-red-100 text-red-800',
  }
  return classes[props.status] ?? classes.Offen
})
</script>

<template>
  <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass">
    {{ status }}
  </span>
</template>
