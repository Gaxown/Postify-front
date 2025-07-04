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
            <!-- Invitations Dropdown -->
            <div class="relative" data-invitations-dropdown>
              <button
                @click="showInvitations = !showInvitations"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Invitations
                <span v-if="pendingInvitations.length > 0" class="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {{ pendingInvitations.length }}
                </span>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showInvitations"
                class="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto"
              >
                <div class="px-4 py-2 border-b border-gray-100">
                  <h3 class="text-sm font-semibold text-gray-900">Team Invitations</h3>
                </div>
                
                <div v-if="pendingInvitations.length === 0" class="px-4 py-6 text-center">
                  <svg class="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <p class="text-sm text-gray-500">No pending invitations</p>
                </div>

                <div v-else class="max-h-64 overflow-y-auto">
                  <div
                    v-for="invitation in pendingInvitations"
                    :key="invitation.id"
                    class="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                  >
                    <div class="flex items-start space-x-3">
                      <div class="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-bold flex-shrink-0" :style="{ backgroundColor: invitation.teamColor }">
                        {{ invitation.teamName.charAt(0) }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-semibold text-gray-900 truncate">{{ invitation.teamName }}</h4>
                        <p class="text-xs text-gray-500">
                          By <span class="font-medium">{{ invitation.invitedBy }}</span> • {{ invitation.role }}
                        </p>
                        <p class="text-xs text-gray-400 mt-1">{{ formatDate(invitation.invitedAt) }}</p>
                        
                        <div class="flex items-center space-x-2 mt-2">
                          <button
                            @click="acceptInvitation(invitation)"
                            class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                          >
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Accept
                          </button>
                          <button
                            @click="rejectInvitation(invitation)"
                            class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                            Refuse
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Create New Team Card -->
        <div
          @click="openCreateModal"
          class="group relative bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 p-8 flex flex-col items-center justify-center min-h-[280px] cursor-pointer transition-all duration-200 hover:shadow-md"
        >
          <div class="w-16 h-16 bg-gray-100 group-hover:bg-purple-100 rounded-full flex items-center justify-center mb-4 transition-colors">
            <svg class="w-8 h-8 text-gray-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Create New Team</h3>
          <p class="text-sm text-gray-500 text-center mt-2">Start collaborating with your team members</p>
        </div>

        <!-- Team Cards -->
        <div
          v-for="team in teams"
          :key="team.id"
          class="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          @click="selectTeam(team)"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold" :style="{ backgroundColor: team.color }">
                {{ team.name.charAt(0) }}
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click.stop="editTeam(team)"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
              </div>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ team.name }}</h3>
            <p class="text-sm text-gray-500 mb-4">{{ team.description }}</p>

            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                {{ team.members.length }} members
              </span>
              <span class="flex items-center">
                <div class="w-2 h-2 rounded-full" :class="team.status === 'active' ? 'bg-green-400' : 'bg-gray-400'"></div>
                <span class="text-xs text-gray-500 capitalize ml-1">{{ team.status }}</span>
              </span>
            </div>

            <div class="flex -space-x-2">
              <div
                v-for="(member, index) in team.members.slice(0, 4)"
                :key="member.id"
                class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                :style="{ backgroundColor: getAvatarColor(member.name) }"
                :title="member.name"
              >
                {{ member.name.charAt(0) }}
              </div>
              <div
                v-if="team.members.length > 4"
                class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600"
              >
                +{{ team.members.length - 4 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Team Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeCreateModal">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 @click.stop">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Create New Team</h3>
        
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
              class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Create Team
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
import { ref, onMounted, onUnmounted } from 'vue'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
}

interface Team {
  id: string
  name: string
  description: string
  color: string
  members: TeamMember[]
  projects?: number
  status: 'active' | 'inactive'
  createdAt: string
}

interface TeamInvitation {
  id: string
  teamName: string
  teamColor: string
  invitedBy: string
  role: string
  invitedAt: string
}

const teams = ref<Team[]>([
  {
    id: '1',
    name: 'Marketing Team',
    description: 'Content creation and social media management',
    color: '#8B5CF6',
    status: 'active',
    createdAt: '2024-01-15',
    projects: 12,
    members: [
      { id: '1', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Manager' },
      { id: '2', name: 'Mike Chen', email: 'mike@company.com', role: 'Designer' },
      { id: '3', name: 'Lisa Wong', email: 'lisa@company.com', role: 'Writer' }
    ]
  },
  {
    id: '2',
    name: 'Product Team',
    description: 'Product development and UX design',
    color: '#3B82F6',
    status: 'active',
    createdAt: '2024-02-01',
    projects: 8,
    members: [
      { id: '4', name: 'Alex Turner', email: 'alex@company.com', role: 'PM' },
      { id: '5', name: 'Rachel Green', email: 'rachel@company.com', role: 'Designer' }
    ]
  }
])

const pendingInvitations = ref<TeamInvitation[]>([
  {
    id: '1',
    teamName: 'Design Squad',
    teamColor: '#EC4899',
    invitedBy: 'Jessica Williams',
    role: 'UI Designer',
    invitedAt: '2024-01-20'
  },
  {
    id: '2',
    teamName: 'Development Team',
    teamColor: '#10B981',
    invitedBy: 'Ahmed Hassan',
    role: 'Frontend Developer',
    invitedAt: '2024-01-18'
  },
  {
    id: '3',
    teamName: 'Marketing Warriors',
    teamColor: '#F59E0B',
    invitedBy: 'Sarah Johnson',
    role: 'Content Creator',
    invitedAt: '2024-01-19'
  },
  {
    id: '4',
    teamName: 'Data Analytics',
    teamColor: '#3B82F6',
    invitedBy: 'Omar Benali',
    role: 'Data Analyst',
    invitedAt: '2024-01-17'
  },
  {
    id: '5',
    teamName: 'Creative Studio',
    teamColor: '#8B5CF6',
    invitedBy: 'Fatima Zahra',
    role: 'Graphic Designer',
    invitedAt: '2024-01-21'
  },
  {
    id: '6',
    teamName: 'Mobile Squad',
    teamColor: '#EF4444',
    invitedBy: 'Youssef Alami',
    role: 'Mobile Developer',
    invitedAt: '2024-01-16'
  },
  {
    id: '7',
    teamName: 'Quality Assurance',
    teamColor: '#06B6D4',
    invitedBy: 'Aicha Mansouri',
    role: 'QA Engineer',
    invitedAt: '2024-01-22'
  },
  {
    id: '8',
    teamName: 'Sales Force',
    teamColor: '#84CC16',
    invitedBy: 'Khalid Benkirane',
    role: 'Sales Representative',
    invitedAt: '2024-01-15'
  },
  {
    id: '9',
    teamName: 'DevOps Heroes',
    teamColor: '#F97316',
    invitedBy: 'Rachid Taha',
    role: 'DevOps Engineer',
    invitedAt: '2024-01-23'
  },
  {
    id: '10',
    teamName: 'Customer Success',
    teamColor: '#A855F7',
    invitedBy: 'Leila Chraibi',
    role: 'Customer Support',
    invitedAt: '2024-01-14'
  },
  {
    id: '11',
    teamName: 'Product Strategy',
    teamColor: '#059669',
    invitedBy: 'Hassan Ouali',
    role: 'Product Manager',
    invitedAt: '2024-01-13'
  },
  {
    id: '12',
    teamName: 'Research Lab',
    teamColor: '#DC2626',
    invitedBy: 'Nadia Bennani',
    role: 'UX Researcher',
    invitedAt: '2024-01-24'
  },
  {
    id: '13',
    teamName: 'Security Team',
    teamColor: '#7C3AED',
    invitedBy: 'Karim El Fassi',
    role: 'Security Specialist',
    invitedAt: '2024-01-12'
  },
  {
    id: '14',
    teamName: 'Content Hub',
    teamColor: '#DB2777',
    invitedBy: 'Meryem Slaoui',
    role: 'Content Writer',
    invitedAt: '2024-01-25'
  },
  {
    id: '15',
    teamName: 'Innovation Lab',
    teamColor: '#2563EB',
    invitedBy: 'Abdellatif Kharbouch',
    role: 'Innovation Lead',
    invitedAt: '2024-01-11'
  }
])

const showCreateModal = ref(false)
const showInvitations = ref(false)
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
}

const closeCreateModal = () => {
  showCreateModal.value = false
  newTeam.value = { name: '', description: '', color: '#8B5CF6' }
}

const createTeam = () => {
  const team: Team = {
    id: Date.now().toString(),
    name: newTeam.value.name,
    description: newTeam.value.description,
    color: newTeam.value.color,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    projects: 0,
    members: [{ id: 'user', name: 'You', email: 'you@company.com', role: 'Owner' }]
  }
  
  teams.value.unshift(team)
  closeCreateModal()
}

const selectTeam = (team: Team) => {
  console.log('Selected team:', team.name)
}

const editTeam = (team: Team) => {
  console.log('Edit team:', team.name)
}

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getAvatarColor = (name: string) => {
  const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899']
  return colors[name.charCodeAt(0) % colors.length]
}

// Close dropdown when clicking outside or pressing Escape
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    const invitationsButton = document.querySelector('[data-invitations-dropdown]')
    
    if (invitationsButton && !invitationsButton.contains(target)) {
      showInvitations.value = false
    }
  }
  
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      showInvitations.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscapeKey)
  })
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