<script setup>
import { RouterLink } from 'vue-router'

const navigation = [
  { label: 'Übersicht', to: '/' },
  { label: 'Matches', to: '/matches' },
  { label: 'Aufgaben', to: '/tasks' },
  { label: 'Mehr', to: '/settings' },
]
</script>

<template>
  <nav
    aria-label="Mobile Navigation"
    class="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-zinc-200 bg-surface md:hidden"
  >
    <RouterLink
      v-for="item in navigation"
      :key="item.to"
      :to="item.to"
      class="flex min-h-16 items-center justify-center px-2 text-center text-xs font-medium text-zinc-500"
      active-class="bg-accent text-primary"
    >
      {{ item.label }}
    </RouterLink>
  </nav>
</template>