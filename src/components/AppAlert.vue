<script setup>
defineProps({
  type: { type: String, default: 'info' },
  message: { type: String, required: true },
})

const styles = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  success: 'border-green-200 bg-green-50 text-green-900',
  error: 'border-red-200 bg-red-50 text-red-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
}
</script>

<template>
  <div
    class="rounded-xl border px-4 py-3 text-sm"
    :class="styles[type] ?? styles.info"
    :role="type === 'error' ? 'alert' : 'status'"
    aria-live="polite"
  >
    {{ message }}
  </div>
</template>
