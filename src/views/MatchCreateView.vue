<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppAlert from '@/components/AppAlert.vue'
import { useMatchStore } from '@/stores/matchStore'
import { validateMatch } from '@/utils/validation'

const router = useRouter()
const store = useMatchStore()

const form = reactive({
  externalId: null,
  homeTeam: '',
  awayTeam: '',
  competition: '',
  date: '',
  time: '',
  stadium: '',
})

const errors = ref({})
const saving = ref(false)
const message = ref('')
const submitError = ref('')

const external = reactive({
  league: 'bl1',
  season: String(new Date().getFullYear()),
  loading: false,
  error: '',
  matches: [],
})

async function submit() {
  errors.value = validateMatch(form)
  if (Object.keys(errors.value).length) return

  saving.value = true
  submitError.value = ''
  message.value = ''

  try {
    const match = await store.createMatch(form)
    message.value = 'Match wurde gespeichert.'
    setTimeout(() => router.push(`/matches/${match.id}`), 450)
  } catch (err) {
    submitError.value = err.message || 'Match konnte nicht gespeichert werden.'
  } finally {
    saving.value = false
  }
}

async function loadExternal() {
  external.loading = true
  external.error = ''
  external.matches = []

  try {
    const rows = await store.loadExternalMatches({
      league: external.league,
      season: external.season,
    })

    const now = new Date()
    external.matches = rows
      .filter((match) => match.date && new Date(`${match.date}T${match.time || '00:00'}`) >= now)
      .slice(0, 12)

    if (!external.matches.length) {
      external.error = 'Für diese Liga und Saison wurden keine kommenden Spiele gefunden.'
    }
  } catch (err) {
    external.error = err.message || 'OpenLigaDB konnte nicht geladen werden.'
  } finally {
    external.loading = false
  }
}

function chooseExternal(match) {
  Object.assign(form, match)
  external.matches = []
  message.value = 'Spieldaten übernommen. Prüfe sie und speichere das Match.'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <section>
      <p class="text-sm font-semibold text-muted">Matchday</p>
      <h2 class="mt-1 text-3xl font-bold text-primary">Match erstellen</h2>
      <p class="mt-2 text-muted">Erfasse das Spiel manuell oder übernimm aktuelle Spieldaten.</p>
    </section>

    <Transition name="fade">
      <AppAlert v-if="message" type="success" :message="message" />
    </Transition>
    <AppAlert v-if="submitError" type="error" :message="submitError" />

    <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form class="rounded-2xl border border-border bg-surface p-6 shadow-sm" novalidate @submit.prevent="submit">
        <h3 class="text-lg font-bold text-primary">Matchdaten</h3>

        <div class="mt-5 grid gap-5 sm:grid-cols-2">
          <label class="block">
            <span class="text-sm font-semibold text-primary">Heimteam *</span>
            <input
              v-model="form.homeTeam"
              type="text"
              class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5"
              :aria-invalid="Boolean(errors.homeTeam)"
            />
            <span v-if="errors.homeTeam" class="mt-1 block text-sm text-red-700">{{ errors.homeTeam }}</span>
          </label>

          <label class="block">
            <span class="text-sm font-semibold text-primary">Auswärtsteam *</span>
            <input
              v-model="form.awayTeam"
              type="text"
              class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5"
              :aria-invalid="Boolean(errors.awayTeam)"
            />
            <span v-if="errors.awayTeam" class="mt-1 block text-sm text-red-700">{{ errors.awayTeam }}</span>
          </label>

          <label class="block">
            <span class="text-sm font-semibold text-primary">Datum *</span>
            <input
              v-model="form.date"
              type="date"
              class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5"
              :aria-invalid="Boolean(errors.date)"
            />
            <span v-if="errors.date" class="mt-1 block text-sm text-red-700">{{ errors.date }}</span>
          </label>

          <label class="block">
            <span class="text-sm font-semibold text-primary">Anspielzeit *</span>
            <input
              v-model="form.time"
              type="time"
              class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5"
              :aria-invalid="Boolean(errors.time)"
            />
            <span v-if="errors.time" class="mt-1 block text-sm text-red-700">{{ errors.time }}</span>
          </label>

          <label class="block">
            <span class="text-sm font-semibold text-primary">Wettbewerb</span>
            <input v-model="form.competition" type="text" class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5" />
          </label>

          <label class="block">
            <span class="text-sm font-semibold text-primary">Stadion</span>
            <input v-model="form.stadium" type="text" class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5" />
          </label>
        </div>

        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <RouterLink to="/matches" class="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold text-primary">
            Abbrechen
          </RouterLink>
          <button type="submit" :disabled="saving" class="rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary">
            {{ saving ? 'Speichert …' : 'Match speichern' }}
          </button>
        </div>
      </form>

      <aside class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 class="text-lg font-bold text-primary">OpenLigaDB</h3>
        <p class="mt-1 text-sm text-muted">Lade reale Spieldaten über die externe Schnittstelle.</p>

        <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <label>
            <span class="text-sm font-semibold text-primary">Liga</span>
            <select v-model="external.league" class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5">
              <option value="bl1">1. Bundesliga</option>
              <option value="bl2">2. Bundesliga</option>
              <option value="bl3">3. Liga</option>
              <option value="ucl">Champions League</option>
              <option value="dfb">DFB-Pokal</option>
            </select>
          </label>

          <label>
            <span class="text-sm font-semibold text-primary">Saison</span>
            <input v-model="external.season" type="number" min="2000" max="2100" class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5" />
          </label>
        </div>

        <button
          type="button"
          :disabled="external.loading"
          class="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white"
          @click="loadExternal"
        >
          {{ external.loading ? 'Lädt Spieldaten …' : 'Spieldaten laden' }}
        </button>

        <AppAlert v-if="external.error" class="mt-4" type="error" :message="external.error" />

        <TransitionGroup name="list" tag="div" class="mt-4 space-y-2">
          <button
            v-for="match in external.matches"
            :key="match.externalId"
            type="button"
            class="w-full rounded-xl border border-border p-3 text-left transition hover:border-zinc-400 hover:bg-zinc-50"
            @click="chooseExternal(match)"
          >
            <span class="block text-xs font-semibold text-muted">{{ match.date }} · {{ match.time }}</span>
            <span class="mt-1 block text-sm font-bold text-primary">{{ match.homeTeam }} – {{ match.awayTeam }}</span>
          </button>
        </TransitionGroup>
      </aside>
    </section>
  </div>
</template>
