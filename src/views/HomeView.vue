<script setup>
import StatusBadge from '@/components/StatusBadge.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const nextMatch = {
  competition: 'Bundesliga',
  homeTeam: 'FC Musterstadt',
  awayTeam: 'City Blue',
  date: '26. April 2025',
  time: '15:30',
  stadium: 'Stadion am Berg',
}

const tasks = [
  {
    id: 1,
    title: 'Starting-XI-Grafik',
    timing: 'Vor dem Spiel',
    status: 'In Arbeit',
  },
  {
    id: 2,
    title: 'Stadion-Stories',
    timing: 'Vor dem Spiel',
    status: 'Offen',
  },
  {
    id: 3,
    title: 'Halbzeit-Update',
    timing: 'Während des Spiels',
    status: 'Offen',
  },
  {
    id: 4,
    title: 'Spielbericht',
    timing: 'Nach dem Spiel',
    status: 'Geplant',
  },
]
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <section>
      <p class="text-sm font-semibold text-zinc-500">
        Übersicht
      </p>

      <h2 class="mt-1 text-3xl font-bold text-primary sm:text-4xl">
        Hallo Yara,
      </h2>

      <p class="mt-1 text-zinc-600">
        der nächste Spieltag steht an.
      </p>
    </section>

    <section
      class="overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-sm sm:p-8"
    >
      <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-zinc-400">
              {{ nextMatch.competition }}
            </span>

            <span class="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
              In 3 Tagen
            </span>
          </div>

          <p class="mt-4 text-sm text-zinc-400">
            {{ nextMatch.date }} · {{ nextMatch.time }} Uhr
          </p>

          <div class="mt-5 flex items-center gap-4 sm:gap-8">
            <div>
              <p class="text-lg font-bold sm:text-xl">
                {{ nextMatch.homeTeam }}
              </p>
            </div>

            <span class="text-xl font-bold text-zinc-500">
              VS.
            </span>

            <div>
              <p class="text-lg font-bold sm:text-xl">
                {{ nextMatch.awayTeam }}
              </p>
            </div>
          </div>

          <p class="mt-5 text-sm text-zinc-400">
            {{ nextMatch.stadium }}
          </p>
        </div>

        <RouterLink
          to="/matches/1"
          class="inline-flex w-fit items-center justify-center rounded-lg border border-zinc-600 px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent"
        >
          Match öffnen
        </RouterLink>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-3">
      <article class="rounded-xl bg-surface p-6 shadow-sm lg:col-span-2">
        <ProgressBar :value="75" />

        <p class="mt-3 text-sm text-zinc-500">
          6 von 8 Aufgaben erledigt
        </p>
      </article>

      <article class="rounded-xl bg-surface p-6 shadow-sm">
        <p class="text-sm font-medium text-zinc-500">
          Nächster Termin
        </p>

        <p class="mt-2 text-2xl font-bold text-primary">
          15:30 Uhr
        </p>

        <p class="mt-1 text-sm text-zinc-500">
          Anpfiff
        </p>
      </article>
    </section>

    <section class="grid gap-6 lg:grid-cols-3">
      <article class="rounded-xl bg-surface p-6 shadow-sm lg:col-span-2">
        <div class="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold text-primary">
              Offene Aufgaben
            </h3>

            <p class="text-sm text-zinc-500">
              Die nächsten Content-Aufgaben
            </p>
          </div>

          <RouterLink
            to="/tasks"
            class="text-sm font-semibold text-zinc-600 hover:text-primary"
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

      <article class="rounded-xl bg-surface p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-primary">
          Quick Actions
        </h3>

        <div class="mt-5 space-y-3">
          <RouterLink
            to="/matches/new"
            class="block rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-primary hover:brightness-95"
          >
            Neues Match planen
          </RouterLink>

          <RouterLink
            to="/templates"
            class="block rounded-lg border border-zinc-200 px-4 py-3 text-center text-sm font-semibold text-primary hover:bg-zinc-50"
          >
            Vorlage verwenden
          </RouterLink>

          <RouterLink
            to="/matches"
            class="block rounded-lg border border-zinc-200 px-4 py-3 text-center text-sm font-semibold text-primary hover:bg-zinc-50"
          >
            Matches ansehen
          </RouterLink>
        </div>
      </article>
    </section>
  </div>
</template>