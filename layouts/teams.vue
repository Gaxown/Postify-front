<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Teams</h1>
            <p class="mt-1 text-gray-500">Manage your teams and collaborate with your colleagues</p>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Team Invitations -->
            <TeamInvitations />
            
            <button
              @click="openCreateModal"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Create Team
            </button>
          </div>
        </div>
      </div>
    </div>



    <!-- Teams Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span class="ml-3 text-gray-600">Loading teams...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">{{ error }}</div>
        <button 
          @click="fetchTeams"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>

      <!-- Teams Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Create New Team Card -->
        <CreateTeamCard @create="openCreateModal" />

        <!-- Team Cards -->
        <TeamCard
          v-for="team in teams"
          :key="team.id"
          :team="team"
        />
      </div>
    </div>

    <!-- Create Team Modal -->
    <CreateFormModal
      ref="createModalRef"
      type="team"
    />

    <!-- Page Content Slot -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TeamCard from '@/components/teams/TeamCard.vue'
import CreateTeamCard from '@/components/teams/CreateTeamCard.vue'
import TeamInvitations from '@/components/teams/TeamInvitations.vue'
import CreateFormModal from '@/components/ui/CreateFormModal.vue'

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

// Direct API integration instead of using composable
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
    // Prepare headers with authentication
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    Object.assign(headers, getAuthHeaders())
    
    const response = await $fetch(`${apiBase}/teams`, {
      method: 'GET',
      headers
    }) as { 
      user: { id: number; name: string; email: string }
      teams: { 
        id: number
        name: string
        description: string
        color: string
        created_at: string
        users?: { id: number; name: string; email: string }[]
      }[]
    }

    teams.value = response.teams.map((team) => ({
      ...team,
      id: team.id.toString(),
      createdAt: team.created_at,
      // Map Laravel user relationships to our expected format
      members: team.users?.map((user) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email
      })) || []
    }))

  } catch (err) {
    const httpError = err as { status?: number }
    if (httpError.status === 401) {
      error.value = 'Please log in to access teams'
    } else {
      error.value = 'Failed to load teams. Please try again.'
    }
    teams.value = []
  } finally {
    loading.value = false
  }
}

const clearError = () => {
  error.value = null
}

// Modal ref
const createModalRef = ref(null)

const openCreateModal = () => {
  clearError() // Clear any previous errors
  if (createModalRef.value) {
    (createModalRef.value as any).openModal()
  }
}

// Load teams when component mounts
onMounted(() => {
  fetchTeams()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 