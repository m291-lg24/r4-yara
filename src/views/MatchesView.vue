<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppAlert from '@/components/AppAlert.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import { useMatchStore } from '@/stores/matchStore'

const store = useMatchStore()
const { matches, loading, error } = storeToRefs(store)

onMounted(() => store.loadAll())

function formatDate(date) {
  return new Intl.DateTimeFormat('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <section class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold text-muted">Planung</p>
        <h2 class="mt-1 text-3xl font-bold text-primary">Matches</h2>
        <p class="mt-2 text-muted">Alle geplanten Matchdays mit ihrem Content-Fortschritt.</p>
      </div>

      <RouterLink to="/matches/new" class="rounded-lg bg-accent px-5 py-3 text-center text-sm font-bold text-primary">
        + Match erstellen
      </RouterLink>
    </section>

    <AppAlert v-if="error" type="error" :message="error" />

    <p v-if="loading && !matches.length" class="rounded-2xl border border-border bg-surface p-6 text-muted">
      Matches werden geladen …
    </p>

    <section v-else-if="matches.length" class="grid gap-4 lg:grid-cols-2">
      <RouterLink
        v-for="match in matches"
        :key="match.id"
        :to="`/matches/${match.id}`"
        class="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-muted">
              {{ match.competition || 'Matchday' }}
            </p>
            <h3 class="mt-2 text-xl font-bold text-primary">
              {{ match.homeTeam }} <span class="text-muted">vs.</span> {{ match.awayTeam }}
            </h3>
          </div>
          <span class="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
            {{ formatDate(match.date) }}
          </span>
        </div>

        <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <span>{{ match.time }} Uhr</span>
          <span>{{ match.stadium || 'Stadion offen' }}</span>
        </div>

        <div class="mt-6">
          <ProgressBar :value="store.getProgressForMatch(match.id)" label="Aufgabenfortschritt" />
        </div>
      </RouterLink>
    </section>

    <section v-else class="rounded-2xl border border-dashed border-zinc-300 bg-surface p-8 text-center">
      <h3 class="text-xl font-bold text-primary">Keine Matches vorhanden</h3>
      <p class="mt-2 text-sm text-muted">Erstelle dein erstes Match oder importiere eines aus OpenLigaDB.</p>
      <RouterLink to="/matches/new" class="mt-5 inline-flex rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary">
        Match erstellen
      </RouterLink>
    </section>
  </div>
</template>
