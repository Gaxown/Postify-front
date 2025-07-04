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
        <div
          @click="openCreateModal"
          class="group relative bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 p-8 flex flex-col items-center justify-center min-h-[280px] cursor-pointer transition-all duration-200 hover:shadow-md"
        >
          <div class="w-16 h-16 bg-gray-100 group-hover:bg-purple-100 rounded-full flex items-center justify-center mb-4 transition-colors">
            <svg class="w-8 h-8 text-gray-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Create New Profile</h3>
          <p class="text-sm text-gray-500 text-center mt-2">Add a new business profile</p>
        </div>

        <!-- Profile Cards -->
        <div
          v-for="profile in profiles"
          :key="profile.id"
          class="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          @click="selectProfile(profile)"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                <img 
                  v-if="profile.avatar" 
                  :src="profile.avatar" 
                  :alt="profile.name"
                  class="w-full h-full object-cover"
                />
                <div 
                  v-else 
                  class="w-full h-full flex items-center justify-center text-white text-xl font-bold"
                  :style="{ backgroundColor: profile.color }"
                >
                  {{ profile.name.charAt(0) }}
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click.stop="editProfile(profile)"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
              </div>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ profile.name }}</h3>
            <p class="text-sm text-gray-500 mb-4">{{ profile.description }}</p>

            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {{ profile.accounts.length }} accounts
              </span>
              <span class="flex items-center">
                <div class="w-2 h-2 rounded-full" :class="profile.status === 'active' ? 'bg-green-400' : 'bg-gray-400'"></div>
                <span class="text-xs text-gray-500 capitalize ml-1">{{ profile.status }}</span>
              </span>
            </div>

            <!-- Platform Icons -->
            <div class="flex space-x-0.5">
              <div
                v-for="platform in profile.platforms.slice(0, 5)"
                :key="platform"
                class="w-8 h-8 flex items-center justify-center"
                :title="platform"
              >
                <!-- Facebook -->
                <Facebook v-if="platform === 'facebook'" class="w-4 h-4 text-blue-600" />
                
                <!-- Instagram -->
                <Instagram v-else-if="platform === 'instagram'" class="w-4 h-4 text-pink-600" />

                <!-- X (Twitter) -->
                <svg v-else-if="platform === 'twitter' || platform === 'x'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>

                <!-- LinkedIn -->
                <Linkedin v-else-if="platform === 'linkedin'" class="w-4 h-4 text-blue-700" />

                <!-- YouTube -->
                <Youtube v-else-if="platform === 'youtube'" class="w-4 h-4 text-red-600" />

                <!-- TikTok -->
                <svg v-else-if="platform === 'tiktok'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>

                <!-- Pinterest -->
                <svg v-else-if="platform === 'pinterest'" class="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.958 1.404-5.958s-.359-.719-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165C4.575 16.71 3.6 14.833 3.6 11.9c0-3.777 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.029 12.017 24.029c6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>

                <!-- Default for unknown platforms -->
                <div v-else class="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center">
                  <span class="text-white text-xs font-bold">{{ platform.substring(0, 1).toUpperCase() }}</span>
                </div>
              </div>
              <div
                v-if="profile.platforms.length > 5"
                class="w-8 h-8 rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-600"
              >
                +{{ profile.platforms.length - 5 }}
              </div>
            </div>
          </div>
        </div>
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
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeCreateModal">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4" @click.stop>
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Create New Profile</h3>
        
        <form @submit.prevent="createProfile">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              v-model="newProfile.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter company name"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="newProfile.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Brief description of the company"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            <div class="flex items-center space-x-4">
              <!-- Avatar Preview -->
              <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                <img 
                  v-if="newProfile.avatar" 
                  :src="newProfile.avatar" 
                  alt="Avatar preview"
                  class="w-full h-full object-cover"
                />
                <div 
                  v-else 
                  class="w-full h-full flex items-center justify-center text-white text-lg font-bold"
                  :style="{ backgroundColor: newProfile.color }"
                >
                  {{ newProfile.name ? newProfile.name.charAt(0) : '?' }}
                </div>
              </div>
              
              <!-- Upload Button -->
              <div class="flex-1">
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  @change="handleAvatarUpload"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Choose Image
                </button>
                <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div class="flex space-x-2">
              <div
                v-for="color in profileColors"
                :key="color"
                @click="newProfile.color = color"
                class="w-8 h-8 rounded-lg cursor-pointer border-2 transition-all"
                :style="{ backgroundColor: color }"
                :class="newProfile.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'"
              ></div>
            </div>
          </div>
          
          <div class="flex space-x-3">
            <button
              type="button"
              @click="closeCreateModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Create Profile
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
import { ref } from 'vue'
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-vue-next'

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
  status: 'active' | 'inactive'
  createdAt: string
}

interface SocialAccount {
  id: string
  platform: string
  username: string
  followers: number
  status: 'connected' | 'disconnected'
}

interface Team {
  id: string
  name: string
  color: string
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
    status: 'active',
    createdAt: '2024-01-15',
    platforms: ['instagram', 'x', 'facebook', 'linkedin', 'youtube'],
    accounts: [
      { id: '1', platform: 'instagram', username: '@techinnovators', followers: 25400, status: 'connected' },
      { id: '2', platform: 'twitter', username: '@tech_innovators', followers: 12800, status: 'connected' },
      { id: '3', platform: 'linkedin', username: 'tech-innovators-ltd', followers: 8500, status: 'connected' }
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
    status: 'active',
    createdAt: '2024-02-01',
    platforms: ['instagram', 'facebook', 'tiktok'],
    accounts: [
      { id: '4', platform: 'instagram', username: '@greenearth', followers: 45200, status: 'connected' },
      { id: '5', platform: 'facebook', username: 'GreenEarthSolutions', followers: 32100, status: 'connected' }
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
    status: 'active',
    createdAt: '2024-01-20',
    platforms: ['instagram', 'x', 'linkedin', 'youtube', 'tiktok', 'pinterest'],
    accounts: [
      { id: '6', platform: 'instagram', username: '@digitalmarketingpro', followers: 18900, status: 'connected' },
      { id: '7', platform: 'youtube', username: 'DigitalMarketingPro', followers: 15600, status: 'connected' }
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

const newProfile = ref({
  name: '',
  description: '',
  color: '#8B5CF6',
  avatar: ''
})

const inviteForm = ref({
  email: ''
})

const profileColors = [
  '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'
]

const avatarInput = ref<HTMLInputElement | null>(null)

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  newProfile.value = { name: '', description: '', color: '#8B5CF6', avatar: '' }
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

const createProfile = () => {
  const profile: Profile = {
    id: Date.now().toString(),
    name: newProfile.value.name,
    description: newProfile.value.description,
    avatar: newProfile.value.avatar,
    color: newProfile.value.color,
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

const editProfile = (profile: Profile) => {
  console.log('Edit profile:', profile.name)
}

const triggerFileInput = () => {
  avatarInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    // Create object URL for preview
    const reader = new FileReader()
    reader.onload = (e) => {
      newProfile.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
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