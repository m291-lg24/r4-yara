<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import AppAlert from '@/components/AppAlert.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { useMatchStore } from '@/stores/matchStore'
import { TASK_CATEGORIES, TASK_STATUSES, validateTask } from '@/utils/validation'

const route = useRoute()
const store = useMatchStore()
const { loading, error } = storeToRefs(store)

const match = computed(() => store.getMatchById(route.params.id))
const tasks = computed(() => store.getTasksForMatch(route.params.id))
const progress = computed(() => store.getProgressForMatch(route.params.id))

const form = reactive({
  matchId: Number(route.params.id),
  title: '',
  category: 'Social Media',
  status: 'Offen',
  publishTime: '',
  notes: '',
})

const formErrors = ref({})
const saving = ref(false)
const success = ref('')
const submitError = ref('')
const statusError = ref('')

onMounted(() => store.loadAll())

async function addTask() {
  formErrors.value = validateTask(form)
  if (Object.keys(formErrors.value).length) return

  saving.value = true
  success.value = ''
  submitError.value = ''

  try {
    await store.createTask(form)
    success.value = 'Aufgabe wurde gespeichert.'
    Object.assign(form, {
      matchId: Number(route.params.id),
      title: '',
      category: 'Social Media',
      status: 'Offen',
      publishTime: '',
      notes: '',
    })
  } catch (err) {
    submitError.value = err.message || 'Aufgabe konnte nicht gespeichert werden.'
  } finally {
    saving.value = false
  }
}

async function changeStatus(task, event) {
  statusError.value = ''
  try {
    await store.updateTaskStatus(task.id, event.target.value)
  } catch (err) {
    statusError.value = err.message || 'Status konnte nicht gespeichert werden.'
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <AppAlert v-if="error" type="error" :message="error" />
    <AppAlert v-if="statusError" type="error" :message="statusError" />

    <p v-if="loading && !match" class="rounded-2xl border border-border bg-surface p-6 text-muted">
      Match wird geladen …
    </p>

    <template v-else-if="match">
      <section class="rounded-2xl bg-primary p-6 text-white shadow-md sm:p-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-semibold text-zinc-400">{{ match.competition || 'Matchday' }}</p>
            <h2 class="mt-2 text-3xl font-bold">{{ match.homeTeam }} <span class="text-zinc-500">vs.</span> {{ match.awayTeam }}</h2>
            <p class="mt-3 text-sm text-zinc-300">{{ match.date }} · {{ match.time }} Uhr · {{ match.stadium || 'Stadion offen' }}</p>
          </div>
          <div class="min-w-64 rounded-xl bg-white/10 p-4">
            <ProgressBar :value="progress" label="Match-Fortschritt" />
          </div>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <article class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-primary">Content-Aufgaben</h3>
              <p class="mt-1 text-sm text-muted">{{ tasks.length }} Aufgaben für dieses Match.</p>
            </div>
          </div>

          <div v-if="tasks.length" class="mt-5 space-y-3">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="rounded-xl border border-border p-4"
            >
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p class="font-bold text-primary">{{ task.title }}</p>
                  <p class="mt-1 text-sm text-muted">{{ task.category }}</p>
                  <p v-if="task.publishTime" class="mt-1 text-xs text-muted">Publikation: {{ task.publishTime }}</p>
                  <p v-if="task.notes" class="mt-2 text-sm text-zinc-600">{{ task.notes }}</p>
                </div>
                <StatusBadge :status="task.status" />
              </div>

              <label class="mt-4 block">
                <span class="text-xs font-semibold uppercase tracking-wide text-muted">Status ändern</span>
                <select
                  :value="task.status"
                  class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm sm:w-56"
                  @change="changeStatus(task, $event)"
                >
                  <option v-for="status in TASK_STATUSES" :key="status" :value="status">{{ status }}</option>
                </select>
              </label>
            </div>
          </div>

          <p v-else class="mt-5 rounded-xl bg-zinc-50 p-4 text-sm text-muted">
            Noch keine Aufgaben. Lege rechts die erste Content-Aufgabe an.
          </p>
        </article>

        <form class="rounded-2xl border border-border bg-surface p-6 shadow-sm" novalidate @submit.prevent="addTask">
          <h3 class="text-lg font-bold text-primary">Aufgabe hinzufügen</h3>
          <p class="mt-1 text-sm text-muted">Die Aufgabe wird direkt in MariaDB gespeichert.</p>

          <Transition name="fade">
            <AppAlert v-if="success" class="mt-4" type="success" :message="success" />
          </Transition>
          <AppAlert v-if="submitError" class="mt-4" type="error" :message="submitError" />

          <div class="mt-5 space-y-4">
            <label class="block">
              <span class="text-sm font-semibold text-primary">Titel *</span>
              <input
                v-model="form.title"
                type="text"
                class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5"
                :aria-invalid="Boolean(formErrors.title)"
              />
              <span v-if="formErrors.title" class="mt-1 block text-sm text-red-700">{{ formErrors.title }}</span>
            </label>

            <label class="block">
              <span class="text-sm font-semibold text-primary">Kategorie *</span>
              <select v-model="form.category" class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5">
                <option v-for="category in TASK_CATEGORIES" :key="category" :value="category">{{ category }}</option>
              </select>
            </label>

            <label class="block">
              <span class="text-sm font-semibold text-primary">Status *</span>
              <select v-model="form.status" class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5">
                <option v-for="status in TASK_STATUSES" :key="status" :value="status">{{ status }}</option>
              </select>
            </label>

            <label class="block">
              <span class="text-sm font-semibold text-primary">Veröffentlichungszeit</span>
              <input v-model="form.publishTime" type="datetime-local" class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5" />
            </label>

            <label class="block">
              <span class="text-sm font-semibold text-primary">Notizen</span>
              <textarea v-model="form.notes" rows="4" class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5" />
            </label>

            <button type="submit" :disabled="saving" class="w-full rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary">
              {{ saving ? 'Speichert …' : 'Aufgabe speichern' }}
            </button>
          </div>
        </form>
      </section>
    </template>

    <section v-else class="rounded-2xl border border-dashed border-zinc-300 bg-surface p-8 text-center">
      <h2 class="text-xl font-bold text-primary">Match nicht gefunden</h2>
      <RouterLink to="/matches" class="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
        Zur Matchübersicht
      </RouterLink>
    </section>
  </div>
</template>
