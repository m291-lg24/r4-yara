<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ProgressBar from '@/components/ProgressBar.vue'
import { useMatchStore } from '@/stores/matchStore'
import { TASK_CATEGORIES } from '@/utils/validation'

const store = useMatchStore()
const { matches, tasks } = storeToRefs(store)

onMounted(() => store.loadAll())

const done = computed(() => tasks.value.filter((task) => task.status === 'Erledigt').length)
const overallProgress = computed(() => (tasks.value.length ? Math.round((done.value / tasks.value.length) * 100) : 0))

const categoryStats = computed(() =>
  TASK_CATEGORIES.map((category) => ({
    category,
    count: tasks.value.filter((task) => task.category === category).length,
  })).filter((item) => item.count > 0),
)
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <section>
      <p class="text-sm font-semibold text-muted">Auswertung</p>
      <h2 class="mt-1 text-3xl font-bold text-primary">Statistiken</h2>
      <p class="mt-2 text-muted">Ein schneller Überblick über die Content-Produktion.</p>
    </section>

    <section class="grid gap-4 sm:grid-cols-3">
      <article class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <p class="text-sm text-muted">Matches</p>
        <p class="mt-2 text-4xl font-bold text-primary">{{ matches.length }}</p>
      </article>
      <article class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <p class="text-sm text-muted">Aufgaben</p>
        <p class="mt-2 text-4xl font-bold text-primary">{{ tasks.length }}</p>
      </article>
      <article class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <p class="text-sm text-muted">Erledigt</p>
        <p class="mt-2 text-4xl font-bold text-primary">{{ done }}</p>
      </article>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <article class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 class="text-lg font-bold text-primary">Gesamtfortschritt</h3>
        <p class="mt-1 text-sm text-muted">Anteil erledigter Aufgaben im gesamten Projekt.</p>
        <div class="mt-6">
          <ProgressBar :value="overallProgress" label="Erledigte Aufgaben" />
        </div>
      </article>

      <article class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 class="text-lg font-bold text-primary">Aufgaben nach Kategorie</h3>
        <div v-if="categoryStats.length" class="mt-5 space-y-3">
          <div v-for="item in categoryStats" :key="item.category" class="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3">
            <span class="text-sm font-semibold text-primary">{{ item.category }}</span>
            <span class="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">{{ item.count }}</span>
          </div>
        </div>
        <p v-else class="mt-5 text-sm text-muted">Noch keine Daten für eine Auswertung.</p>
      </article>
    </section>
  </div>
</template>
