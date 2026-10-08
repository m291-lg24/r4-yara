<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppAlert from '@/components/AppAlert.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { useMatchStore } from '@/stores/matchStore'

const store = useMatchStore()
const { nextMatch, openTasks, completedCount, totalTaskCount, progress, loading, error, matches, tasks } =
  storeToRefs(store)

onMounted(() => store.loadAll())

const statistics = computed(() => [
  { label: 'Matches', value: matches.value.length },
  { label: 'Aufgaben', value: tasks.value.length },
  { label: 'Erledigt', value: tasks.value.filter((task) => task.status === 'Erledigt').length },
  {
    label: 'Offen',
    value: tasks.value.filter((task) => task.status !== 'Erledigt').length,
  },
])

function formatDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <section>
      <p class="text-sm font-semibold text-muted">Übersicht</p>
      <h2 class="mt-1 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Hallo Yara,</h2>
      <p class="mt-1 text-base text-muted">hier siehst du den aktuellen Stand für den nächsten Matchday.</p>
    </section>

    <Transition name="fade">
      <AppAlert v-if="error" type="error" :message="`${error} Prüfe /api/health oder das Deployment.`" />
    </Transition>

    <section v-if="loading && !matches.length" class="rounded-2xl border border-border bg-surface p-8 text-center">
      <p class="font-semibold text-primary">Daten werden geladen …</p>
      <p class="mt-1 text-sm text-muted">Matches, Aufgaben und Vorlagen werden vom Server abgerufen.</p>
    </section>

    <template v-else-if="nextMatch">
      <section class="relative overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-md sm:p-8">
        <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

        <div class="relative z-10">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <span class="text-sm font-medium text-zinc-300">{{ nextMatch.competition || 'Matchday' }}</span>
            <span class="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-primary">Nächstes Match</span>
          </div>

          <p class="mt-5 text-sm text-zinc-400">{{ formatDate(nextMatch.date) }} · {{ nextMatch.time }} Uhr</p>

          <div class="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4 sm:gap-8">
              <p class="text-xl font-bold sm:text-2xl">{{ nextMatch.homeTeam }}</p>
              <span class="text-sm font-bold uppercase tracking-widest text-zinc-500">vs.</span>
              <p class="text-xl font-bold sm:text-2xl">{{ nextMatch.awayTeam }}</p>
            </div>

            <RouterLink
              :to="`/matches/${nextMatch.id}`"
              class="inline-flex items-center justify-center rounded-lg border border-zinc-600 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
            >
              Match öffnen
            </RouterLink>
          </div>

          <p class="mt-6 text-sm text-zinc-400">{{ nextMatch.stadium || 'Stadion noch offen' }}</p>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-3">
        <article class="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <ProgressBar :value="progress" />
          <p class="mt-4 text-sm text-muted">{{ completedCount }} von {{ totalTaskCount }} Aufgaben erledigt</p>
        </article>

        <article class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <p class="text-sm font-semibold text-muted">Anspielzeit</p>
          <p class="mt-3 text-3xl font-bold text-primary">{{ nextMatch.time }}</p>
          <p class="mt-1 text-sm text-muted">{{ formatDate(nextMatch.date) }}</p>
        </article>
      </section>

      <section class="grid gap-6 xl:grid-cols-3">
        <article class="rounded-2xl border border-border bg-surface p-6 shadow-sm xl:col-span-2">
          <div class="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-primary">Offene Aufgaben</h3>
              <p class="mt-1 text-sm text-muted">Die nächsten Content-Aufgaben für dieses Match.</p>
            </div>
            <RouterLink to="/tasks" class="text-sm font-semibold text-muted transition hover:text-primary">
              Alle anzeigen
            </RouterLink>
          </div>

          <div v-if="openTasks.length" class="divide-y divide-zinc-100">
            <div
              v-for="task in openTasks.slice(0, 5)"
              :key="task.id"
              class="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p class="font-semibold text-primary">{{ task.title }}</p>
                <p class="mt-1 text-sm text-muted">{{ task.category }}</p>
              </div>
              <StatusBadge :status="task.status" />
            </div>
          </div>

          <p v-else class="rounded-xl bg-zinc-50 p-4 text-sm text-muted">
            Keine offenen Aufgaben. Für dieses Match ist alles erledigt.
          </p>
        </article>

        <article class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h3 class="text-lg font-bold text-primary">Schnellzugriff</h3>
          <p class="mt-1 text-sm text-muted">Häufige Aktionen.</p>

          <div class="mt-5 space-y-3">
            <RouterLink
              to="/matches/new"
              class="block rounded-lg bg-accent px-4 py-3 text-center text-sm font-bold text-primary transition hover:brightness-95"
            >
              + Neues Match
            </RouterLink>
            <RouterLink
              :to="`/matches/${nextMatch.id}`"
              class="block rounded-lg border border-border px-4 py-3 text-center text-sm font-semibold text-primary transition hover:bg-zinc-50"
            >
              Aufgabe hinzufügen
            </RouterLink>
            <RouterLink
              to="/templates"
              class="block rounded-lg border border-border px-4 py-3 text-center text-sm font-semibold text-primary transition hover:bg-zinc-50"
            >
              Vorlagen
            </RouterLink>
          </div>
        </article>
      </section>
    </template>

    <section v-else class="rounded-2xl border border-dashed border-zinc-300 bg-surface p-8 text-center">
      <h3 class="text-xl font-bold text-primary">Noch kein Match geplant</h3>
      <p class="mx-auto mt-2 max-w-xl text-sm text-muted">
        Erstelle ein Match manuell oder übernimm aktuelle Spieldaten aus OpenLigaDB.
      </p>
      <RouterLink
        to="/matches/new"
        class="mt-5 inline-flex rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary"
      >
        Erstes Match erstellen
      </RouterLink>
    </section>

    <section>
      <h3 class="mb-4 text-lg font-bold text-primary">Projekt-Statistik</h3>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="statistic in statistics"
          :key="statistic.label"
          class="rounded-2xl border border-border bg-surface p-5 shadow-sm"
        >
          <p class="text-sm text-muted">{{ statistic.label }}</p>
          <p class="mt-2 text-3xl font-bold text-primary">{{ statistic.value }}</p>
        </article>
      </div>
    </section>
  </div>
</template>
