<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Business Profiles</h1>
              <p class="mt-1 text-gray-500">
                Manage your company profiles and social media accounts
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            
            
            <button
              v-if="selectedTeamId"
              @click="openInviteModal"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Send Invitation
            </button>
            <button
              v-if="selectedTeamId"
              @click="openCreateModal"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Create Profile
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <span class="ml-3 text-gray-600">Loading profiles...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center py-12">
        <div class="text-red-600 mb-4">{{ error }}</div>
        <div class="space-x-3">
          <button 
            v-if="selectedTeamId"
            @click="fetchProfiles"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Profiles Grid -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- No team selected -->
      <div v-if="!selectedTeamId" class="text-center py-12">
        <div class="text-gray-500 mb-4">Please select a team to view profiles</div>
      </div>

      <!-- No profiles found -->
      <div v-else-if="profiles.length === 0" class="text-center py-12">
        <div class="text-gray-500 mb-4">No profiles found for this team</div>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Create First Profile
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Create New Profile Card -->
        <CreateProfileCard @create="openCreateModal" />

        <!-- Profile Cards -->
        <ProfileCard
          v-for="profile in profiles"
          :key="profile.id"
          :profile="profile"
          :profile-id="profile.id"
        />
      </div>
    </div>

    <!-- Send Invitation Dropdown -->
    <div v-if="showInviteModal" class="fixed inset-0 z-40" @click="closeInviteModal" @keydown.esc="closeInviteModal">
      <div class="absolute top-20 right-8 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Send Invitation</h3>
          <button @click="closeInviteModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="sendInvitation" class="space-y-3">
          <div>
            <input
              v-model="inviteForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-sm"
              placeholder="Enter email address"
            />
          </div>

          <button
            type="submit"
            class="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
          >
            Send Invitation
          </button>
        </form>
      </div>
    </div>

    <!-- Create Profile Modal -->
    <CreateFormModal
      ref="createModalRef"
      type="profile"
    />

    <!-- Page Content Slot -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProfileCard, { type Profile } from '@/components/profile/ProfileCard.vue'
import CreateProfileCard from '@/components/profile/CreateProfileCard.vue'
import CreateFormModal from '@/components/ui/CreateFormModal.vue'

// Reactive data
const profiles = ref<Profile[]>([])
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const selectedTeamId = ref<number | null>(null)

// Modal refs
const createModalRef = ref<{ openModal: () => void } | null>(null)

// Get API base URL from runtime config
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

// Use authentication composable
const { getAuthHeaders, isAuthenticated } = useAuth()

// Get route to check for team parameter
const route = useRoute()

// Initialize from URL and load profiles
const initializeFromUrl = async () => {
  if (!isAuthenticated.value) {
    return
  }

  // Get team ID from route params (from /teams/[id]/profile)
  const teamIdFromParams = route.params.id ? parseInt(route.params.id as string) : null
  
  if (teamIdFromParams) {
    selectedTeamId.value = teamIdFromParams
    await fetchProfiles()
  } else {
    error.value = 'Please select a team to view profiles'
  }
}

// API call to fetch profiles for a specific team
const fetchProfiles = async () => {
  if (!selectedTeamId.value) return
  
  // Check if user is authenticated
  if (!isAuthenticated.value) {
    error.value = 'Please log in to access profiles'
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    // Prepare headers with authentication
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    Object.assign(headers, getAuthHeaders())
    
    const response = await $fetch(`${apiBase}/teams/${selectedTeamId.value}/profiles`, {
      method: 'GET',
      headers
    }) as { id: number; name: string; description?: string; avatar?: string; color?: string; social_accounts?: { platform: string }[] }[]
    
    // Transform API response - keep only what's needed
    profiles.value = response.map((profile) => ({
      id: profile.id,
      name: profile.name || '',
      description: profile.description || 'No description available',
      avatar: profile.avatar ? `${apiBase.replace('/api', '')}/storage/${profile.avatar}` : '',
      color: profile.color || '#8B5CF6',
      accounts: profile.social_accounts?.map((acc) => ({
        platform: acc.platform
      })) || []
    }))
  } catch (err) {
    const httpError = err as { status?: number }
    if (httpError.status === 401) {
      error.value = 'Please log in to access profiles'
    } else {
      error.value = 'Failed to load profiles. Please try again.'
    }
    profiles.value = []
  } finally {
    loading.value = false
  }
}

// Load profiles when component mounts
onMounted(async () => {
  await initializeFromUrl()
})

const showInviteModal = ref(false)

const inviteForm = ref({
  email: ''
})

const openCreateModal = () => {
  if (createModalRef.value) {
    createModalRef.value.openModal()
  }
}

const openInviteModal = () => {
  showInviteModal.value = true
}

const closeInviteModal = () => {
  showInviteModal.value = false
  inviteForm.value = { email: '' }
}

const sendInvitation = () => {
  // Here you would normally send the invitation to your backend
  closeInviteModal()
}

// createProfile function removed - now handled by CreateFormModal internally
// selectProfile function removed - no more click events on profile cards

</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 