<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMatchStore } from '@/stores/matchStore'

const store = useMatchStore()
const { tasks } = storeToRefs(store)
onMounted(() => store.loadAll())

const mediaItems = computed(() =>
  tasks.value
    .filter((task) => ['Grafik', 'Foto', 'Video'].includes(task.category))
    .slice(0, 12),
)
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <section>
      <p class="text-sm font-semibold text-muted">Assets</p>
      <h2 class="mt-1 text-3xl font-bold text-primary">Mediathek</h2>
      <p class="mt-2 text-muted">Produktionsübersicht für Grafik-, Foto- und Videoaufgaben.</p>
    </section>

    <section v-if="mediaItems.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="item in mediaItems"
        :key="item.id"
        class="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
      >
        <div class="flex aspect-video items-center justify-center bg-primary text-5xl font-black text-accent">
          {{ item.category.charAt(0) }}
        </div>
        <div class="p-5">
          <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ item.category }}</p>
          <h3 class="mt-2 font-bold text-primary">{{ item.title }}</h3>
          <p class="mt-2 text-sm text-muted">{{ item.status }}</p>
        </div>
      </article>
    </section>

    <section v-else class="rounded-2xl border border-dashed border-zinc-300 bg-surface p-8 text-center">
      <h3 class="font-bold text-primary">Noch keine Medienaufgaben</h3>
      <p class="mt-2 text-sm text-muted">Grafik-, Foto- und Videoaufgaben erscheinen hier automatisch.</p>
    </section>
  </div>
</template>
