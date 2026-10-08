<script setup>
import { reactive, ref } from 'vue'
import AppAlert from '@/components/AppAlert.vue'

const stored = JSON.parse(localStorage.getItem('matchday-settings') || '{}')
const settings = reactive({
  clubName: stored.clubName || '',
  compactMode: Boolean(stored.compactMode),
  reminders: stored.reminders ?? true,
})

const saved = ref(false)

function save() {
  localStorage.setItem('matchday-settings', JSON.stringify(settings))
  saved.value = true
  setTimeout(() => (saved.value = false), 1800)
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <section>
      <p class="text-sm font-semibold text-muted">Personalisierung</p>
      <h2 class="mt-1 text-3xl font-bold text-primary">Einstellungen</h2>
      <p class="mt-2 text-muted">Diese Einstellungen bleiben nur in diesem Browser gespeichert.</p>
    </section>

    <Transition name="fade">
      <AppAlert v-if="saved" type="success" message="Einstellungen wurden lokal gespeichert." />
    </Transition>

    <form class="rounded-2xl border border-border bg-surface p-6 shadow-sm" @submit.prevent="save">
      <label class="block">
        <span class="text-sm font-semibold text-primary">Vereinsname</span>
        <input v-model="settings.clubName" type="text" class="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5" />
      </label>

      <label class="mt-5 flex items-start gap-3 rounded-xl bg-zinc-50 p-4">
        <input v-model="settings.compactMode" type="checkbox" class="mt-1 h-4 w-4" />
        <span>
          <span class="block text-sm font-semibold text-primary">Kompakte Darstellung</span>
          <span class="mt-1 block text-sm text-muted">Merkt sich die Präferenz für spätere Erweiterungen.</span>
        </span>
      </label>

      <label class="mt-3 flex items-start gap-3 rounded-xl bg-zinc-50 p-4">
        <input v-model="settings.reminders" type="checkbox" class="mt-1 h-4 w-4" />
        <span>
          <span class="block text-sm font-semibold text-primary">Erinnerungen vormerken</span>
          <span class="mt-1 block text-sm text-muted">Aktuell nur als lokale Einstellung gespeichert.</span>
        </span>
      </label>

      <button type="submit" class="mt-6 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary">
        Speichern
      </button>
    </form>
  </div>
</template>
