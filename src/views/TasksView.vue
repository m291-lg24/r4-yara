<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppAlert from '@/components/AppAlert.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { useMatchStore } from '@/stores/matchStore'
import { TASK_CATEGORIES, TASK_STATUSES } from '@/utils/validation'

const store = useMatchStore()
const { tasks, matches, loading, error } = storeToRefs(store)

const category = ref('Alle')
const status = ref('Alle')
const saveError = ref('')

onMounted(() => store.loadAll())

const filteredTasks = computed(() =>
  tasks.value.filter((task) => {
    const categoryFits = category.value === 'Alle' || task.category === category.value
    const statusFits = status.value === 'Alle' || task.status === status.value
    return categoryFits && statusFits
  }),
)

const hasActiveFilter = computed(() => category.value !== 'Alle' || status.value !== 'Alle')

function resetFilters() {
  category.value = 'Alle'
  status.value = 'Alle'
}

function matchName(matchId) {
  const match = matches.value.find((item) => item.id === matchId)
  return match ? `${match.homeTeam} – ${match.awayTeam}` : 'Unbekanntes Match'
}

async function changeStatus(task, event) {
  saveError.value = ''
  try {
    await store.updateTaskStatus(task.id, event.target.value)
  } catch (err) {
    saveError.value = err.message || 'Status konnte nicht gespeichert werden.'
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <section>
      <p class="text-sm font-semibold text-muted">Produktion</p>
      <h2 class="mt-1 text-3xl font-bold text-primary">Aufgaben</h2>
      <p class="mt-2 text-muted">Filtere Content-Aufgaben und ändere ihren Status direkt.</p>
    </section>

    <AppAlert v-if="error" type="error" :message="error" />
    <AppAlert v-if="saveError" type="error" :message="saveError" />

    <section class="grid gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:grid-cols-2">
      <label>
        <span class="text-sm font-semibold text-primary">Kategorie</span>
        <select v-model="category" class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5">
          <option>Alle</option>
          <option v-for="item in TASK_CATEGORIES" :key="item">{{ item }}</option>
        </select>
      </label>

      <label>
        <span class="text-sm font-semibold text-primary">Status</span>
        <select v-model="status" class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5">
          <option>Alle</option>
          <option v-for="item in TASK_STATUSES" :key="item">{{ item }}</option>
        </select>
      </label>

      <div class="flex flex-wrap items-center gap-2 text-sm sm:col-span-2" aria-live="polite">
        <span class="font-semibold text-primary">Aktiver Filter:</span>
        <template v-if="hasActiveFilter">
          <span v-if="category !== 'Alle'" class="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
            Kategorie: {{ category }}
          </span>
          <span v-if="status !== 'Alle'" class="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
            Status: {{ status }}
          </span>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-xs font-semibold text-muted underline hover:text-primary"
            @click="resetFilters"
          >
            Filter zurücksetzen
          </button>
        </template>
        <span v-else class="text-muted">keiner – alle Aufgaben werden angezeigt</span>
        <span class="ml-auto text-muted">{{ filteredTasks.length }} von {{ tasks.length }} Aufgaben</span>
      </div>
    </section>

    <p v-if="loading && !tasks.length" class="rounded-2xl border border-border bg-surface p-6 text-muted">
      Aufgaben werden geladen …
    </p>

    <section v-else-if="filteredTasks.length" class="space-y-3">
      <article
        v-for="task in filteredTasks"
        :key="task.id"
        class="rounded-2xl border border-border bg-surface p-5 shadow-sm"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-bold text-primary">{{ task.title }}</h3>
              <StatusBadge :status="task.status" />
            </div>
            <p class="mt-2 text-sm text-muted">{{ matchName(task.matchId) }} · {{ task.category }}</p>
            <p v-if="task.notes" class="mt-2 text-sm text-zinc-600">{{ task.notes }}</p>
          </div>

          <label class="block lg:w-52">
            <span class="text-xs font-semibold uppercase tracking-wide text-muted">Status</span>
            <select
              :value="task.status"
              class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
              @change="changeStatus(task, $event)"
            >
              <option v-for="item in TASK_STATUSES" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>
        </div>
      </article>
    </section>

    <section v-else class="rounded-2xl border border-dashed border-zinc-300 bg-surface p-8 text-center">
      <h3 class="font-bold text-primary">Keine Aufgaben für diesen Filter</h3>
      <p class="mt-2 text-sm text-muted">Ändere Kategorie oder Status.</p>
    </section>
  </div>
</template>