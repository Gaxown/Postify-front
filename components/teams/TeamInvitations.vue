<template>
  <div class="relative" data-invitations-dropdown>
    <!-- Invitations Button -->
    <button
      @click="showDropdown = !showDropdown"
      class="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
      </svg>
      Invitations
      <span v-if="invitations.length > 0" class="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
        {{ invitations.length }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="showDropdown"
      class="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto"
    >
      <div class="px-4 py-2 border-b border-gray-100">
        <h3 class="text-sm font-semibold text-gray-900">Team Invitations</h3>
      </div>
      
      <div v-if="loading" class="px-4 py-6 text-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
        <p class="text-sm text-gray-500">Loading invitations...</p>
      </div>
      
      <div v-else-if="invitations.length === 0" class="px-4 py-6 text-center">
        <svg class="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
        </svg>
        <p class="text-sm text-gray-500">No pending invitations</p>
      </div>

      <div v-else class="max-h-64 overflow-y-auto">
        <div
          v-for="invitation in invitations"
          :key="invitation.id"
          class="px-4 py-3 mb-2 mx-2  border rounded-lg last:border-0 bg-gray-100"
        >
          <div class="flex items-start space-x-3">
            <div v-if="invitation.team.logo" class="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              <img :src="invitation.team.logo" alt="Team Logo" class="w-full h-full object-cover rounded-md">
            </div>
            <div v-else class="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-bold flex-shrink-0" :style="{ backgroundColor: invitation.team.color }">
              {{ invitation.team.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <div class="items-center space-x-2 ">
                  <h4 class="text-sm font-semibold text-gray-900 truncate">{{ invitation.team.name }}</h4>
                  <p class="text-xs text-gray-500">by {{ invitation.sender.name }}</p> 
                </div>
                <div>
                  <p class="text-xs text-gray-400">{{ formatDate(invitation.created_at || invitation.updated_at) }}</p>
                </div>
              </div>
                
              
              <div class="flex items-center space-x-2 mt-2">
                <button
                  @click="acceptInvitation(invitation.id)"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Accept
                </button>
                <button
                @click="rejectInvitation(invitation.id)"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Invitation {
  id: number
  // team_id: number
  // sender_id: number
  // receiver_id: number
  created_at: string | null
  updated_at: string | null
  team: {
    id: number
    name: string
    color: string
    logo: string | null 
    // description: string | null
  }
  sender: {
    // id: number
    name: string
    // email: string
  }
}

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:8000/api'

const showDropdown = ref(false)
const invitations = ref<Invitation[]>([])
const loading = ref(false)

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'No date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Fetch invitations from API
const fetchInvitations = async () => {
  loading.value = true
  
  try {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'   
    }
    Object.assign(headers, getAuthHeaders())
    
    const response = await $fetch(`${apiBase}/invites`, {
      method: 'GET',
      headers
    }) as Invitation[]

    invitations.value = response.map(invitation => ({
      ...invitation,
      team: {
        ...invitation.team,
        logo: invitation.team.logo ? `${apiBase.replace('/api', '')}/storage/${invitation.team.logo}` : ''
      },
      sender: {
        ...invitation.sender
      }
    }))
  } catch (error) {
    console.error('Error fetching invitations:', error)
    invitations.value = []
  } finally {
    loading.value = false
  }
}

const acceptInvitation = async (invitationId: number) => {
  try {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    Object.assign(headers, getAuthHeaders())
    
    await $fetch(`${apiBase}/invites/${invitationId}/accept`, {
      method: 'POST',
      headers
    })
    
    window.location.reload()
  } catch (error) {
    console.error('Error accepting invitation:', error)
  }
}

const rejectInvitation = async (invitationId: number) => {
  try {
    const headers = {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    }
    Object.assign(headers, getAuthHeaders())
    await $fetch(`${apiBase}/invites/${invitationId}/reject`, {
      method: 'POST',
      headers
    })

    fetchInvitations()
  }catch (error) {
    console.error('Error refusing invitation:', error)
}

}
// Close dropdown when clicking outside or pressing Escape
onMounted(() => {
  // Fetch invitations on mount
  fetchInvitations()
  
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    const invitationsButton = document.querySelector('[data-invitations-dropdown]')
    
    if (invitationsButton && !invitationsButton.contains(target)) {
      showDropdown.value = false
    }
  }
  
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      showDropdown.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscapeKey)
  })
})

// Expose the fetch function for external calls
defineExpose({
  fetchInvitations
})
</script> 