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
            <TeamInvitations
              :invitations="pendingInvitations"
              @accept="acceptInvitation"
              @reject="rejectInvitation"
            />
            
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
          :team="team as any"
          @select="selectTeam"
        />
      </div>
    </div>

    <!-- Create Team Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeCreateModal">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4" @click.stop>
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Create New Team</h3>
        
        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
        
        <form @submit.prevent="createTeam">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
            <input
              v-model="newTeam.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter team name"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="newTeam.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe your team's purpose"
            ></textarea>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Team Color</label>
            <div class="flex space-x-2">
              <div
                v-for="color in teamColors"
                :key="color"
                @click="newTeam.color = color"
                :class="[
                  'w-8 h-8 rounded-lg cursor-pointer border-2 transition-all',
                  newTeam.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                ]"
                :style="{ backgroundColor: color }"
              ></div>
            </div>
          </div>
          
          <div class="flex space-x-3">
            <button
              type="button"
              @click="closeCreateModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </span>
              <span v-else>Create Team</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Page Content Slot -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TeamCard from '@/components/teams/TeamCard.vue'
import CreateTeamCard from '@/components/teams/CreateTeamCard.vue'
import TeamInvitations from '@/components/teams/TeamInvitations.vue'

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

interface TeamInvitation {
  id: string
  teamName: string
  teamColor: string
  invitedBy: string
  invitedAt: string
}

// Use teams composable for API integration
const { teams, loading, error, fetchTeams, createTeam: createTeamAPI, selectTeam: selectTeamAPI, clearError } = useTeams()

const pendingInvitations = ref<TeamInvitation[]>([
  {
    id: '1',
    teamName: 'Design Squad',
    teamColor: '#EC4899',
    invitedBy: 'Jessica Williams',
    invitedAt: '2024-01-20'
  },
  {
    id: '2',
    teamName: 'Development Team',
    teamColor: '#10B981',
    invitedBy: 'Ahmed Hassan',
    invitedAt: '2024-01-18'
  },
  {
    id: '3',
    teamName: 'Marketing Warriors',
    teamColor: '#F59E0B',
    invitedBy: 'Sarah Johnson',
    invitedAt: '2024-01-19'
  },
  {
    id: '4',
    teamName: 'Data Analytics',
    teamColor: '#3B82F6',
    invitedBy: 'Omar Benali',
    invitedAt: '2024-01-17'
  },
  {
    id: '5',
    teamName: 'Creative Studio',
    teamColor: '#8B5CF6',
    invitedBy: 'Fatima Zahra',
    invitedAt: '2024-01-21'
  },
  {
    id: '6',
    teamName: 'Mobile Squad',
    teamColor: '#EF4444',
    invitedBy: 'Youssef Alami',
    invitedAt: '2024-01-16'
  },
  {
    id: '7',
    teamName: 'Quality Assurance',
    teamColor: '#06B6D4',
    invitedBy: 'Aicha Mansouri',
    invitedAt: '2024-01-22'
  },
  {
    id: '8',
    teamName: 'Sales Force',
    teamColor: '#84CC16',
    invitedBy: 'Khalid Benkirane',
    invitedAt: '2024-01-15'
  },
  {
    id: '9',
    teamName: 'DevOps Heroes',
    teamColor: '#F97316',
    invitedBy: 'Rachid Taha',
    invitedAt: '2024-01-23'
  },
  {
    id: '10',
    teamName: 'Customer Success',
    teamColor: '#A855F7',
    invitedBy: 'Leila Chraibi',
    invitedAt: '2024-01-14'
  },
  {
    id: '11',
    teamName: 'Product Strategy',
    teamColor: '#059669',
    invitedBy: 'Hassan Ouali',
    invitedAt: '2024-01-13'
  },
  {
    id: '12',
    teamName: 'Research Lab',
    teamColor: '#DC2626',
    invitedBy: 'Nadia Bennani',
    invitedAt: '2024-01-24'
  },
  {
    id: '13',
    teamName: 'Security Team',
    teamColor: '#7C3AED',
    invitedBy: 'Karim El Fassi',
    invitedAt: '2024-01-12'
  },
  {
    id: '14',
    teamName: 'Content Hub',
    teamColor: '#DB2777',
    invitedBy: 'Meryem Slaoui',
    invitedAt: '2024-01-25'
  },
  {
    id: '15',
    teamName: 'Innovation Lab',
    teamColor: '#2563EB',
    invitedBy: 'Abdellatif Kharbouch',
    invitedAt: '2024-01-11'
  }
])

const showCreateModal = ref(false)
const newTeam = ref({
  name: '',
  description: '',
  color: '#8B5CF6'
})

const teamColors = [
  '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'
]

const openCreateModal = () => {
  showCreateModal.value = true
  clearError() // Clear any previous errors
}

const closeCreateModal = () => {
  showCreateModal.value = false
  newTeam.value = { name: '', description: '', color: '#8B5CF6' }
  clearError() // Clear errors when closing
}

const createTeam = async () => {
  try {
    await createTeamAPI({
      name: newTeam.value.name,
      description: newTeam.value.description,
      color: newTeam.value.color
    })
    closeCreateModal()
  } catch (err) {
    console.error('Failed to create team:', err)
    // Error is already set in the composable, no need to handle here
    // The error will be displayed in the modal
  }
}

const selectTeam = (team: any) => {
  selectTeamAPI(team)
}

// Load teams when component mounts
onMounted(() => {
  fetchTeams()
})

const acceptInvitation = (invitation: TeamInvitation) => {
  // Remove from pending invitations
  const index = pendingInvitations.value.findIndex(inv => inv.id === invitation.id)
  if (index !== -1) {
    pendingInvitations.value.splice(index, 1)
  }
  
  // Add user to the team (in a real app, you'd make an API call)
  console.log(`Accepted invitation to join ${invitation.teamName}`)
  
  // You could add logic here to add the user to the actual team
  // For example, find the team and add current user to members
}

const rejectInvitation = (invitation: TeamInvitation) => {
  // Remove from pending invitations
  const index = pendingInvitations.value.findIndex(inv => inv.id === invitation.id)
  if (index !== -1) {
    pendingInvitations.value.splice(index, 1)
  }
  
  console.log(`Rejected invitation to join ${invitation.teamName}`)
}


</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 