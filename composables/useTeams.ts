import { ref } from 'vue'

interface TeamMember {
  id: string
  name: string
  email: string
}

interface Team {
  id: string
  name: string
  description: string
  color: string
  members: TeamMember[]
  projects?: number
  createdAt: string
}

export const useTeams = () => {
  const { getAuthHeaders } = useAuth()
  const teams = ref<Team[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:8000/api'

  const fetchTeams = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{
        user: any
        teams: any[]
      }>(`${apiBase}/teams`, {
        headers: {
          ...getAuthHeaders()
        } as any
      })

      teams.value = response.teams.map((team: any) => ({
        ...team,
        id: team.id.toString(),
        // Map Laravel user relationships to our expected format
        members: team.users?.map((user: any) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email
        })) || []
      }))

    } catch (err: any) {
      error.value = err.data?.message || 'Failed to fetch teams'
      console.error('Error fetching teams:', err)
    } finally {
      loading.value = false
    }
  }

  const createTeam = async (teamData: {
    name: string
    description: string
    color: string
  }) => {
    loading.value = true
    error.value = null

    try {
      console.log('Sending team data:', teamData) // Debug log
      
      const newTeam = await $fetch<any>(`${apiBase}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        } as any,
        body: teamData
      })

      console.log('Received team:', newTeam) // Debug log

      // Format the new team to match our interface
      const formattedTeam = {
        ...newTeam,
        id: newTeam.id.toString(),
        members: newTeam.users?.map((user: any) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email
        })) || []
      }

      // Add the new team to the beginning of the list
      teams.value.unshift(formattedTeam)
      return formattedTeam

    } catch (err: any) {
      console.error('Error creating team:', err)
      
      // Handle validation errors from Laravel
      if (err.status === 422 && err.data?.errors) {
        const validationErrors = Object.values(err.data.errors).flat().join(', ')
        error.value = validationErrors
      } else if (err.data?.message) {
        error.value = err.data.message
      } else {
        error.value = 'Failed to create team'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const selectTeam = (team: Team) => {
    // Handle team selection (e.g., navigate to team dashboard)
    console.log('Selected team:', team.name)
    // You can add navigation logic here
    // navigateTo(`/teams/${team.id}`)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    teams: readonly(teams),
    loading: readonly(loading),
    error: readonly(error),
    fetchTeams,
    createTeam,
    selectTeam,
    clearError
  }
} 