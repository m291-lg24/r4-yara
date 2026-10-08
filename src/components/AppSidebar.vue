<script setup>
import { RouterLink } from 'vue-router'

const navigation = [
  { label: 'Übersicht', to: '/' },
  { label: 'Matches', to: '/matches' },
  { label: 'Aufgaben', to: '/tasks' },
  { label: 'Vorlagen', to: '/templates' },
  { label: 'Statistiken', to: '/statistics' },
  { label: 'Mediathek', to: '/media' },
  { label: 'Einstellungen', to: '/settings' },
]
</script>

<template>
  <aside class="fixed inset-y-0 left-0 hidden w-64 flex-col bg-primary px-4 py-6 text-white md:flex">
    <RouterLink to="/" class="mb-8 rounded-lg px-3 py-2">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Matchday</p>
      <p class="text-xl font-bold">Content Planner</p>
    </RouterLink>

    <nav aria-label="Hauptnavigation" class="flex flex-1 flex-col gap-1">
      <RouterLink
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        class="rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:bg-secondary hover:text-white"
        active-class="bg-accent !text-primary"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <RouterLink
      to="/about"
      class="rounded-lg px-4 py-3 text-sm text-zinc-400 transition hover:bg-secondary hover:text-white"
      active-class="bg-accent !text-primary"
    >
      Über & Datenschutz
    </RouterLink>
  </aside>
</template>
