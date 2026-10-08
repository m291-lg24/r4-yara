import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useMatchStore = defineStore('match', () => {
  const matches = ref([
    {
      id: 1,
      competition: 'Bundesliga',
      homeTeam: 'FC Musterstadt',
      awayTeam: 'City Blue',
      date: 'Sa, 26. April 2025',
      time: '15:30',
      stadium: 'Stadion am Berg',
    },
  ])

  const tasks = ref([
    {
      id: 1,
      matchId: 1,
      title: 'Starting-XI-Grafik',
      timing: 'Vor dem Spiel',
      category: 'Grafik',
      status: 'In Arbeit',
    },
    {
      id: 2,
      matchId: 1,
      title: 'Stadion-Stories',
      timing: 'Vor dem Spiel',
      category: 'Social Media',
      status: 'Offen',
    },
    {
      id: 3,
      matchId: 1,
      title: 'Spielbericht',
      timing: 'Nach dem Spiel',
      category: 'Text',
      status: 'Geplant',
    },
    {
      id: 4,
      matchId: 1,
      title: 'Matchday-Post',
      timing: 'Vor dem Spiel',
      category: 'Social Media',
      status: 'Erledigt',
    },
    {
      id: 5,
      matchId: 1,
      title: 'Team-Ankunft',
      timing: 'Vor dem Spiel',
      category: 'Video',
      status: 'Erledigt',
    },
    {
      id: 6,
      matchId: 1,
      title: 'Warm-up-Fotos',
      timing: 'Vor dem Spiel',
      category: 'Foto',
      status: 'Erledigt',
    },
    {
      id: 7,
      matchId: 1,
      title: 'Kickoff-Story',
      timing: 'Während des Spiels',
      category: 'Social Media',
      status: 'Erledigt',
    },
    {
      id: 8,
      matchId: 1,
      title: 'Halbzeit-Grafik',
      timing: 'Während des Spiels',
      category: 'Grafik',
      status: 'Erledigt',
    },
    {
      id: 9,
      matchId: 1,
      title: 'Goal-Content',
      timing: 'Während des Spiels',
      category: 'Social Media',
      status: 'Erledigt',
    },
    {
      id: 10,
      matchId: 1,
      title: 'Resultat-Grafik',
      timing: 'Nach dem Spiel',
      category: 'Grafik',
      status: 'Erledigt',
    },
    {
      id: 11,
      matchId: 1,
      title: 'Highlight-Clip',
      timing: 'Nach dem Spiel',
      category: 'Video',
      status: 'Erledigt',
    },
    {
      id: 12,
      matchId: 1,
      title: 'Fotogalerie',
      timing: 'Nach dem Spiel',
      category: 'Foto',
      status: 'Erledigt',
    },
  ])

  const nextMatch = computed(() => matches.value[0] ?? null)

  const tasksForNextMatch = computed(() => {
    if (!nextMatch.value) return []

    return tasks.value.filter(
      (task) => task.matchId === nextMatch.value.id,
    )
  })

  const openTasks = computed(() =>
    tasksForNextMatch.value.filter(
      (task) => task.status !== 'Erledigt',
    ),
  )

  const completedCount = computed(
    () =>
      tasksForNextMatch.value.filter(
        (task) => task.status === 'Erledigt',
      ).length,
  )

  const totalTaskCount = computed(
    () => tasksForNextMatch.value.length,
  )

  const progress = computed(() => {
    if (totalTaskCount.value === 0) return 0

    return Math.round(
      (completedCount.value / totalTaskCount.value) * 100,
    )
  })

  function setTaskStatus(taskId, status) {
    const task = tasks.value.find((item) => item.id === taskId)

    if (!task) return

    task.status = status
  }

  return {
    matches,
    tasks,
    nextMatch,
    openTasks,
    completedCount,
    totalTaskCount,
    progress,
    setTaskStatus,
  }
})