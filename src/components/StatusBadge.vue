<script setup>
defineProps({
  status: {
    type: String,
    required: true,
  },
})

const styles = {
  Offen: 'bg-zinc-100 text-zinc-700',
  'In Arbeit': 'bg-blue-100 text-blue-700',
  Geplant: 'bg-violet-100 text-violet-700',
  Erledigt: 'bg-green-100 text-green-700',
  Überfällig: 'bg-red-100 text-red-700',
}
</script>

<template>
  <span
    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
    :class="styles[status] ?? styles.Offen"
  >
    {{ status }}
  </span>
</template>