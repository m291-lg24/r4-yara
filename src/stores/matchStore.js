import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { calculateProgress } from '@/utils/validation'

const API_BASE = '/api'

function normalizeMatch(row) {
  return {
    id: Number(row.id),
    externalId: row.external_id ? Number(row.external_id) : null,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    competition: row.competition || '',
    date: row.match_date,
    time: row.kickoff_time?.slice(0, 5) || '',
    stadium: row.stadium || '',
    createdAt: row.created_at || null,
  }
}

function normalizeTask(row) {
  return {
    id: Number(row.id),
    matchId: Number(row.match_id),
    title: row.title,
    category: row.category,
    status: row.status,
    publishTime: row.publish_time || '',
    notes: row.notes || '',
    createdAt: row.created_at || null,
  }
}

function normalizeTemplate(row) {
  return {
    id: Number(row.id),
    name: row.name,
    description: row.description || '',
    createdAt: row.created_at || null,
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    ...options,
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Serverfehler (${response.status}).`)
  }

  return payload
}

export const useMatchStore = defineStore('match', () => {
  const matches = ref([])
  const tasks = ref([])
  const templates = ref([])
  const loading = ref(false)
  const error = ref('')
  const initialized = ref(false)

  const nextMatch = computed(() => {
    if (!matches.value.length) return null

    const now = new Date()
    const sorted = [...matches.value].sort((a, b) => {
      return new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`)
    })

    return (
      sorted.find((match) => new Date(`${match.date}T${match.time || '23:59'}`) >= now) ??
      sorted.at(-1)
    )
  })

  const tasksForNextMatch = computed(() => {
    if (!nextMatch.value) return []
    return tasks.value.filter((task) => task.matchId === nextMatch.value.id)
  })

  const openTasks = computed(() =>
    tasksForNextMatch.value.filter((task) => task.status !== 'Erledigt'),
  )

  const completedCount = computed(
    () => tasksForNextMatch.value.filter((task) => task.status === 'Erledigt').length,
  )

  const totalTaskCount = computed(() => tasksForNextMatch.value.length)
  const progress = computed(() => calculateProgress(tasksForNextMatch.value))

  async function loadAll(force = false) {
    if (loading.value) return
    if (initialized.value && !force) return

    loading.value = true
    error.value = ''

    try {
      const [matchPayload, taskPayload, templatePayload] = await Promise.all([
        apiRequest('/matches'),
        apiRequest('/tasks'),
        apiRequest('/templates'),
      ])

      matches.value = (matchPayload.data || []).map(normalizeMatch)
      tasks.value = (taskPayload.data || []).map(normalizeTask)
      templates.value = (templatePayload.data || []).map(normalizeTemplate)
      initialized.value = true
    } catch (err) {
      error.value = err.message || 'Die Daten konnten nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  function getMatchById(id) {
    return matches.value.find((match) => match.id === Number(id)) ?? null
  }

  function getTasksForMatch(id) {
    return tasks.value.filter((task) => task.matchId === Number(id))
  }

  function getProgressForMatch(id) {
    return calculateProgress(getTasksForMatch(id))
  }

  async function createMatch(form) {
    const payload = await apiRequest('/matches', {
      method: 'POST',
      body: JSON.stringify({
        external_id: form.externalId ?? null,
        home_team: form.homeTeam.trim(),
        away_team: form.awayTeam.trim(),
        competition: form.competition?.trim() || '',
        match_date: form.date,
        kickoff_time: form.time,
        stadium: form.stadium?.trim() || '',
      }),
    })

    const match = normalizeMatch(payload.data)
    matches.value.push(match)
    return match
  }

  async function createTask(form) {
    const payload = await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        match_id: Number(form.matchId),
        title: form.title.trim(),
        category: form.category,
        status: form.status,
        publish_time: form.publishTime || null,
        notes: form.notes?.trim() || '',
      }),
    })

    const task = normalizeTask(payload.data)
    tasks.value.push(task)
    return task
  }

  async function updateTaskStatus(taskId, status) {
    const task = tasks.value.find((item) => item.id === Number(taskId))
    if (!task) return

    const previous = task.status
    task.status = status

    try {
      const payload = await apiRequest(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
      Object.assign(task, normalizeTask(payload.data))
    } catch (err) {
      task.status = previous
      throw err
    }
  }

  async function createTemplate(form) {
    const payload = await apiRequest('/templates', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name.trim(),
        description: form.description?.trim() || '',
      }),
    })

    const template = normalizeTemplate(payload.data)
    templates.value.push(template)
    return template
  }

  async function loadExternalMatches({ league = 'bl1', season = new Date().getFullYear() } = {}) {
    const payload = await apiRequest(
      `/openliga?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`,
    )

    return (payload.data || []).map((item) => ({
      externalId: Number(item.matchID),
      homeTeam: item.team1?.teamName || 'Heimteam',
      awayTeam: item.team2?.teamName || 'Auswärtsteam',
      competition: item.leagueName || league,
      date: String(item.matchDateTime || '').slice(0, 10),
      time: String(item.matchDateTime || '').slice(11, 16),
      stadium: item.location?.locationStadium || item.location?.locationCity || '',
    }))
  }

  return {
    matches,
    tasks,
    templates,
    loading,
    error,
    initialized,
    nextMatch,
    tasksForNextMatch,
    openTasks,
    completedCount,
    totalTaskCount,
    progress,
    loadAll,
    getMatchById,
    getTasksForMatch,
    getProgressForMatch,
    createMatch,
    createTask,
    updateTaskStatus,
    createTemplate,
    loadExternalMatches,
  }
})
