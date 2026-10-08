<script setup>
import { storeToRefs } from 'pinia'

import StatusBadge from '@/components/StatusBadge.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import { useMatchStore } from '@/stores/matchStore'

const matchStore = useMatchStore()

const {
  nextMatch,
  openTasks,
  completedCount,
  totalTaskCount,
  progress,
} = storeToRefs(matchStore)

const statistics = [
  { label: 'Matches', value: 12 },
  { label: 'Geplante Inhalte', value: 72 },
  { label: 'Veröffentlicht', value: 45 },
  { label: 'Abdeckung', value: '78 %' },
]
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">

    <!-- Begrüssung -->
    <section>
      <p class="text-sm font-semibold text-zinc-500">
        Übersicht
      </p>

      <h2 class="mt-1 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
        Hallo Yara,
      </h2>

      <p class="mt-1 text-base text-zinc-500">
        der nächste Spieltag steht an.
      </p>
    </section>

    <!-- Match Hero -->
    <section
      class="relative overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-md sm:p-8"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20"
      />

      <div class="relative z-10">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <span class="text-sm font-medium text-zinc-300">
            {{ nextMatch.competition }}
          </span>

          <span
            class="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-primary"
          >
            In 3 Tagen
          </span>
        </div>

        <p class="mt-5 text-sm text-zinc-400">
          {{ nextMatch.date }} · {{ nextMatch.time }} Uhr
        </p>

        <div
          class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-4 sm:gap-8">
            <div>
              <p class="text-xl font-bold sm:text-2xl">
                {{ nextMatch.homeTeam }}
              </p>
            </div>

            <span class="text-xl font-bold text-zinc-500">
              VS.
            </span>

            <div>
              <p class="text-xl font-bold sm:text-2xl">
                {{ nextMatch.awayTeam }}
              </p>
            </div>
          </div>

          <RouterLink
            to="/matches/1"
            class="inline-flex items-center justify-center rounded-lg border border-zinc-600 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
          >
            Match öffnen
          </RouterLink>
        </div>

        <p class="mt-6 text-sm text-zinc-400">
          {{ nextMatch.stadium }}
        </p>
      </div>
    </section>

    <!-- Fortschritt + Termin -->
    <section class="grid gap-6 lg:grid-cols-3">
      <article
        class="rounded-2xl border border-zinc-200 bg-surface p-6 shadow-sm lg:col-span-2"
      >
        <ProgressBar :value="75" />

        <p class="mt-4 text-sm text-zinc-500">
          6 von 8 Aufgaben erledigt
        </p>
      </article>

      <article
        class="rounded-2xl border border-zinc-200 bg-surface p-6 shadow-sm"
      >
        <p class="text-sm font-semibold text-zinc-500">
          Nächster Termin
        </p>

        <p class="mt-3 text-3xl font-bold text-primary">
          15:30
        </p>

        <p class="mt-1 text-sm text-zinc-500">
          Anpfiff
        </p>
      </article>
    </section>

    <!-- Aufgaben + Quick Actions -->
    <section class="grid gap-6 xl:grid-cols-3">

      <article
        class="rounded-2xl border border-zinc-200 bg-surface p-6 shadow-sm xl:col-span-2"
      >
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-bold text-primary">
              Offene Aufgaben
            </h3>

            <p class="mt-1 text-sm text-zinc-500">
              Die nächsten Content-Aufgaben
            </p>
          </div>

          <RouterLink
            to="/tasks"
            class="text-sm font-semibold text-zinc-500 transition hover:text-primary"
          >
            Alle anzeigen
          </RouterLink>
        </div>

        <div class="divide-y divide-zinc-100">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="font-semibold text-primary">
                {{ task.title }}
              </p>

              <p class="mt-1 text-sm text-zinc-500">
                {{ task.timing }}
              </p>
            </div>

            <StatusBadge :status="task.status" />
          </div>
        </div>
      </article>

      <article
        class="rounded-2xl border border-zinc-200 bg-surface p-6 shadow-sm"
      >
        <h3 class="text-lg font-bold text-primary">
          Quick Actions
        </h3>

        <p class="mt-1 text-sm text-zinc-500">
          Häufige Aktionen
        </p>

        <div class="mt-5 space-y-3">
          <RouterLink
            to="/matches/new"
            class="block rounded-lg bg-accent px-4 py-3 text-center text-sm font-bold text-primary transition hover:brightness-95"
          >
            + Neues Match planen
          </RouterLink>

          <RouterLink
            to="/templates"
            class="block rounded-lg border border-zinc-200 px-4 py-3 text-center text-sm font-semibold text-primary transition hover:bg-zinc-50"
          >
            Vorlage verwenden
          </RouterLink>

          <RouterLink
            to="/matches"
            class="block rounded-lg border border-zinc-200 px-4 py-3 text-center text-sm font-semibold text-primary transition hover:bg-zinc-50"
          >
            Matches ansehen
          </RouterLink>
        </div>
      </article>
    </section>

    <!-- Statistiken -->
    <section>
      <h3 class="mb-4 text-lg font-bold text-primary">
        Saison-Statistiken
      </h3>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="statistic in statistics"
          :key="statistic.label"
          class="rounded-2xl border border-zinc-200 bg-surface p-5 shadow-sm"
        >
          <p class="text-sm text-zinc-500">
            {{ statistic.label }}
          </p>

          <p class="mt-2 text-3xl font-bold text-primary">
            {{ statistic.value }}
          </p>
        </article>
      </div>
    </section>

  </div>
</template>