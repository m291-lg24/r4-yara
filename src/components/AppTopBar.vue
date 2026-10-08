<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title ?? 'Matchday Content Planner')
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
    <div class="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div>
        <p class="text-xs font-medium uppercase tracking-wider text-muted">Matchday Content Planner</p>
        <h1 class="text-lg font-semibold text-primary">{{ title }}</h1>
      </div>

      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
        aria-label="Benutzerprofil Yara"
      >
        Y
      </div>
    </div>
  </header>
</template>
