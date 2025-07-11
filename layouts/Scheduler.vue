<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <header class="bg-white border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-8">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span class="text-white font-bold text-sm">P</span>
            </div>
            <span class="font-semibold text-gray-900">Postify</span>
          </div>
          <nav class="flex space-x-6">
            <a href="#" class="text-gray-600 hover:text-gray-900 font-medium">Create</a>
            <a href="#" class="text-blue-600 font-medium border-b-2 border-blue-600 pb-3">Publish</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 font-medium">Engage</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 font-medium">Analyze</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 font-medium">Start Page</a>
          </nav>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
            <Plus class="w-4 h-4" />
            <span>New</span>
          </button>
          <button class="p-2 text-gray-600 hover:text-gray-900">
            <Filter class="w-5 h-5" />
          </button>
          <button class="p-2 text-gray-600 hover:text-gray-900">
            <HelpCircle class="w-5 h-5" />
          </button>
          <button class="p-2 text-gray-600 hover:text-gray-900">
            <Gift class="w-5 h-5" />
          </button>
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User class="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <SchedulerSidebar :profile-id="profileId" @account-selected="handleAccountSelected" />

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <!-- Profile Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
                          <div class="relative">
                <div class="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                     :class="selectedAccount ? 'bg-gray-800' : 'bg-blue-600'">
                  <!-- All Channels icon when no specific account selected -->
                  <svg v-if="!selectedAccount" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <!-- Account specific avatar -->
                  <template v-else>
                    <img
                      v-if="selectedAccount.avatar && selectedAccount.avatar.trim()"
                      :src="selectedAccount.avatar"
                      :alt="selectedAccount.account_name"
                      class="w-full h-full object-cover"
                    />
                    <span
                      v-else
                      class="text-white font-medium"
                    >
                      {{ getAccountInitials(selectedAccount.account_name) }}
                    </span>
                  </template>
                </div>
                <div v-if="selectedAccount" class="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <PlatformIcon 
                    :platform="selectedAccount.platform.toLowerCase()" 
                    class="w-3 h-3"
                  />
                </div>
              </div>
            <div>
              <div class="flex items-center space-x-2">
                <h1 class="text-xl font-semibold text-gray-900">
                  {{ selectedAccount?.account_name || 'All Channels' }}
                </h1>
                <CheckCircle class="w-4 h-4 text-gray-400" />
              </div>
              <p class="text-sm text-gray-600">
                {{ selectedAccount ? `${selectedAccount.platform} • 0/30 posts sent this week` : 'View all your connected social accounts' }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <Share2 class="w-4 h-4" />
              <span>Share Feedback</span>
            </button>
            <div class="flex items-center bg-gray-100 rounded-lg">
              <button class="px-3 py-2 text-sm font-medium bg-white rounded-lg shadow-sm">
                <List class="w-4 h-4 inline mr-1" />
                List
              </button>
              <button class="px-3 py-2 text-sm font-medium text-gray-600">
                <Calendar class="w-4 h-4 inline mr-1" />
                Calendar
              </button>
            </div>
            <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
              <Plus class="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex space-x-8">
            <button class="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">
              Queue <span class="ml-1 text-gray-500">0</span>
            </button>
            <button class="text-gray-600 hover:text-gray-900 font-medium pb-2">
              Drafts <span class="ml-1 text-gray-500">0</span>
            </button>
            <button class="text-gray-600 hover:text-gray-900 font-medium pb-2 flex items-center">
              Approvals <span class="ml-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
            <button class="text-gray-600 hover:text-gray-900 font-medium pb-2">
              Sent <span class="ml-1 text-gray-500">21</span>
            </button>
          </div>
          <div class="flex items-center space-x-3">
            <button class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <Tag class="w-4 h-4" />
              <span>Tags</span>
              <ChevronDown class="w-4 h-4" />
            </button>
            <button class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <MapPin class="w-4 h-4" />
              <span>Casablanca</span>
            </button>
            <button class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <span>More</span>
              <ChevronDown class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Schedule Content -->
        <!-- When specific account is selected -->
        <div v-if="selectedAccount" class="space-y-6">
          <!-- Today Section -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Today, June 30</h3>
            <div class="space-y-3">
              <div v-for="time in todayTimes" :key="time" class="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                <div class="text-sm font-medium text-gray-900 w-16">{{ time }}</div>
                <button @click="openCreateModal" class="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Plus class="w-4 h-4" />
                  <span class="text-sm font-medium">New</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Tomorrow Section -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Tomorrow, July 1</h3>
            <div class="space-y-3">
              <div v-for="time in tomorrowTimes" :key="time" class="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                <div class="text-sm font-medium text-gray-900 w-16">{{ time }}</div>
                <button @click="openCreateModal" class="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Plus class="w-4 h-4" />
                  <span class="text-sm font-medium">New</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- When All Channels is selected -->
        <div v-else class="flex flex-col items-center justify-center py-16">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No posts scheduled</h3>
          <p class="text-gray-600 mb-6">Schedule some posts and they will appear here</p>
          <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
            <Plus class="w-4 h-4" />
            <span>New Post</span>
          </button>
        </div>
      </main>
    </div>

    <!-- Create Post Modal -->
    <CreatePostModal ref="createPostModalRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Plus, Filter, HelpCircle, Gift, User, X, CheckCircle, Share2, 
  List, Calendar, MapPin, Tag, ChevronDown
} from 'lucide-vue-next'
import CreatePostModal from '@/components/posts/CreatePostModal.vue'
import SchedulerSidebar from '@/components/layout/SchedulerSidebar.vue'
import PlatformIcon from '@/components/ui/PlatformIcon.vue'

// Get profile ID from route (passed from the page)
const route = useRoute()
const profileId = route.params.id

// Selected account state
const selectedAccount = ref(null)

const todayTimes = ['11:06 AM', '11:08 AM', '11:27 AM', '11:28 AM', '2:56 PM', '3:51 PM', '4:00 PM']
const tomorrowTimes = ['11:06 AM', '11:08 AM', '11:27 AM']

const createPostModalRef = ref()

const openCreateModal = () => {
  if (createPostModalRef.value) {
    createPostModalRef.value.openModal()
  }
}

// Handle account selection from sidebar
const handleAccountSelected = (account) => {
  selectedAccount.value = account
}

// Get initials from account name
const getAccountInitials = (name) => {
  if (!name) return 'U'
  const names = name.split(' ')
  if (names.length === 1) return names[0][0].toUpperCase()
  return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>