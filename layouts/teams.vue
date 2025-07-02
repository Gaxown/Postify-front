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
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
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

const getAvatarColor = (name: string) => {
  const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899']
  return colors[name.charCodeAt(0) % colors.length]
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