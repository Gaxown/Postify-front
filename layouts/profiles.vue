<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Business Profiles</h1>
            <p class="mt-1 text-gray-500">Manage your company profiles and social media accounts</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="openInviteModal"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Send Invitation
            </button>
            <button
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

    <!-- Profiles Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Create New Profile Card -->
        <CreateProfileCard @create="openCreateModal" />

        <!-- Profile Cards -->
        <ProfileCard
          v-for="profile in profiles"
          :key="profile.id"
          :profile="profile"
          @select="selectProfile"
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
      :show-modal="showCreateModal"
      type="profile"
      @close="closeCreateModal"
      @submit="createProfile"
    />

    <!-- Page Content Slot -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import ProfileAvatar from '@/components/profile/ProfileAvatar.vue'
import CreateProfileCard from '@/components/profile/CreateProfileCard.vue'
import CreateFormModal from '@/components/ui/CreateFormModal.vue'

interface SocialAccount {
  id: string
  platform: string
  username: string
  followers: number
  status?: string
}

interface Profile {
  id: string
  name: string
  description: string
  avatar?: string
  color: string
  teamId: string
  teamName: string
  teamColor: string
  accounts: SocialAccount[]
  platforms: string[]
  createdAt: string
  status?: string
}

const profiles = ref<Profile[]>([
  {
    id: '1',
    name: 'Tech Innovators Ltd',
    description: 'Leading technology solutions company',
    avatar: '',
    color: '#8B5CF6',
    teamId: '1',
    teamName: 'Marketing Team',
    teamColor: '#8B5CF6',
    createdAt: '2024-01-15',
    platforms: ['instagram', 'x', 'facebook', 'linkedin', 'youtube'],
    accounts: [
      { id: '1', platform: 'instagram', username: '@techinnovators', followers: 25400 },
      { id: '2', platform: 'x', username: '@tech_innovators', followers: 12800 },
      { id: '3', platform: 'linkedin', username: 'tech-innovators-ltd', followers: 8500 }
    ]
  },
  {
    id: '2',
    name: 'Green Earth Solutions',
    description: 'Sustainable and eco-friendly products',
    avatar: '',
    color: '#10B981',
    teamId: '1',
    teamName: 'Marketing Team',
    teamColor: '#8B5CF6',
    createdAt: '2024-02-01',
    platforms: ['instagram', 'facebook', 'tiktok'],
    accounts: [
      { id: '4', platform: 'instagram', username: '@greenearth', followers: 45200 },
      { id: '5', platform: 'facebook', username: 'GreenEarthSolutions', followers: 32100 }
    ]
  },
  {
    id: '3',
    name: 'Digital Marketing Pro',
    description: 'Professional digital marketing services',
    avatar: '',
    color: '#3B82F6',
    teamId: '2',
    teamName: 'Product Team',
    teamColor: '#3B82F6',
    createdAt: '2024-01-20',
    platforms: ['instagram', 'x', 'linkedin', 'youtube', 'tiktok', 'pinterest'],
    accounts: [
      { id: '6', platform: 'instagram', username: '@digitalmarketingpro', followers: 18900 },
      { id: '7', platform: 'youtube', username: 'DigitalMarketingPro', followers: 15600 }
    ]
  },
  {
    id: '4',
    name: 'Fashion Forward',
    description: 'Trendy fashion and lifestyle brand',
    avatar: '',
    color: '#EC4899',
    teamId: '1',
    teamName: 'Marketing Team',
    teamColor: '#8B5CF6',
    status: 'active',
    createdAt: '2024-01-25',
    platforms: ['instagram', 'tiktok', 'pinterest', 'facebook'],
    accounts: [
      { id: '8', platform: 'instagram', username: '@fashionforward', followers: 67300, status: 'connected' },
      { id: '9', platform: 'tiktok', username: '@fashion_forward', followers: 124500, status: 'connected' }
    ]
  },
  {
    id: '5',
    name: 'Andalous',
    description: 'Traditional Moroccan cuisine restaurant',
    avatar: '',
    color: '#F59E0B',
    teamId: '3',
    teamName: 'Sales Team',
    teamColor: '#10B981',
    status: 'active',
    createdAt: '2024-02-10',
    platforms: ['instagram', 'facebook', 'tiktok'],
    accounts: [
      { id: '10', platform: 'instagram', username: '@restaurant_andalus', followers: 12400, status: 'connected' },
      { id: '11', platform: 'facebook', username: 'RestaurantAndalus', followers: 8900, status: 'connected' },
      { id: '12', platform: 'tiktok', username: '@andalus_food', followers: 5600, status: 'connected' }
    ]
  },
  {
    id: '6',
    name: 'TechStart Morocco',
    description: 'Startup accelerator and tech hub',
    avatar: '',
    color: '#7C3AED',
    teamId: '2',
    teamName: 'Product Team',
    teamColor: '#3B82F6',
    status: 'active',
    createdAt: '2024-01-30',
    platforms: ['linkedin', 'twitter', 'youtube', 'instagram'],
    accounts: [
      { id: '13', platform: 'linkedin', username: 'techstart-morocco', followers: 15200, status: 'connected' },
      { id: '14', platform: 'twitter', username: '@techstartma', followers: 9800, status: 'connected' },
      { id: '15', platform: 'youtube', username: 'TechStartMorocco', followers: 4300, status: 'connected' }
    ]
  },
  {
    id: '7',
    name: 'Atlas Fitness Center',
    description: 'Premium fitness and wellness center',
    avatar: '',
    color: '#EF4444',
    teamId: '1',
    teamName: 'Marketing Team',
    teamColor: '#8B5CF6',
    status: 'active',
    createdAt: '2024-02-05',
    platforms: ['instagram', 'tiktok', 'facebook', 'youtube'],
    accounts: [
      { id: '16', platform: 'instagram', username: '@atlas_fitness', followers: 23700, status: 'connected' },
      { id: '17', platform: 'tiktok', username: '@atlas_gym', followers: 18900, status: 'connected' },
      { id: '18', platform: 'youtube', username: 'AtlasFitnessCenter', followers: 7400, status: 'connected' }
    ]
  }
])

const showCreateModal = ref(false)
const showInviteModal = ref(false)

const inviteForm = ref({
  email: ''
})

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
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
  console.log('Sending invitation to:', inviteForm.value.email)
  
  alert(`Invitation sent to ${inviteForm.value.email}`)
  closeInviteModal()
}

const createProfile = (formData: any) => {
  const profile: Profile = {
    id: Date.now().toString(),
    name: formData.name,
    description: formData.description,
    avatar: formData.avatar,
    color: formData.color,
    teamId: '',
    teamName: '',
    teamColor: '#8B5CF6',
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    platforms: [],
    accounts: []
  }
  
  profiles.value.unshift(profile)
  closeCreateModal()
}

const selectProfile = (profile: Profile) => {
  console.log('Selected profile:', profile.name)
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