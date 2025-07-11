<template>
  <aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-gray-900">Channels</h2>
      </div>

      <!-- All Channels Section -->
      <div class="mb-4">
        <div 
          @click="selectAllChannels"
          class="flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors"
          :class="isAllChannelsSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'"
        >
          <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-900">All Channels</div>
          </div>
          <span class="bg-white px-2 py-1 rounded text-xs font-medium text-gray-600">{{ totalPostsCount }}</span>
        </div>
      </div>

      <div class="space-y-2">

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-red-600 text-sm p-2">
          {{ error }}
        </div>

        <!-- Social Account Items -->
        <div v-else class="space-y-1">
          <div
            v-for="channel in displayChannels"
            :key="channel.key"
          >
            <!-- Connected Account View -->
            <div
              v-if="channel.isConnected"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              :class="{ 'bg-blue-50 border border-blue-200': !isAllChannelsSelected && selectedAccountId === channel.account?.id }"
              @click="selectAccount(channel.account)"
            >
              <div class="relative">
                <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    v-if="channel.account.avatar && channel.account.avatar.trim()"
                    :src="channel.account.avatar"
                    :alt="channel.account.account_name"
                    class="w-full h-full object-cover"
                  />
                  <span
                    v-else
                    class="text-sm font-medium text-gray-600 initials-span"
                  >
                    {{ getAccountInitials(channel.account.account_name) }}
                  </span>
                </div>
                <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full shadow-lg flex items-center justify-center overflow-hidden">
                  <PlatformIcon :platform="channel.key" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-900 truncate">{{ channel.account.account_name }}</div>
                <div class="text-xs text-gray-500 capitalize">{{ channel.name }}</div>
              </div>
              <span class="bg-gray-100 px-2 py-1 rounded text-xs">0</span>
            </div>

            <!-- Connect Button View -->
            <button
              v-else
              class="flex items-center space-x-3 p-2 w-full text-left rounded-lg hover:bg-gray-50"
            >
              <div class="w-10 h-10 rounded-full border border-dashed border-gray-300 flex items-center justify-center">
                <div class="w-5 h-5">
                  <PlatformIcon :platform="channel.key" class="grayscale opacity-75" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-700">Connect {{ channel.name }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom sidebar items -->
    <div class="absolute bottom-4 left-4 space-y-2">
      <button class="flex items-center space-x-3 p-2 w-full text-left hover:bg-gray-50 rounded-lg">
        <Tag class="w-4 h-4 text-gray-600" />
        <span class="text-sm text-gray-700">Manage Tags</span>
      </button>
      <button class="flex items-center space-x-3 p-2 w-full text-left hover:bg-gray-50 rounded-lg">
        <Settings class="w-4 h-4 text-gray-600" />
        <span class="text-sm text-gray-700">Manage Channels</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import {
  Plus, ChevronDown, Tag, Settings
} from 'lucide-vue-next'
import PlatformIcon from '@/components/ui/PlatformIcon.vue'

interface SocialAccount {
  id: number
  profile_id: number
  platform: string
  account_name: string
  access_token: string
  refresh_token?: string | null
  expires_at?: string | null
  social_id?: string | null
  avatar?: string | null
  email?: string | null
  created_at: string
  updated_at: string
}

interface Props {
  profileId: string | number
}

const props = defineProps<Props>()

// Add emit for selected account
const emit = defineEmits<{
  accountSelected: [account: SocialAccount | null]
}>()

const ALL_PLATFORMS = [
  { key: 'facebook', name: 'Facebook' },
  { key: 'instagram', name: 'Instagram' },
  { key: 'twitter', name: 'X' },
  { key: 'linkedin', name: 'LinkedIn' },
  { key: 'pinterest', name: 'Pinterest' },
  { key: 'tiktok', name: 'TikTok' },
]

// Reactive data
const socialAccounts = ref<SocialAccount[]>([])
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const selectedAccountId = ref<number | null>(null)
const isAllChannelsSelected = ref(true)

const displayChannels = computed(() => {
  return ALL_PLATFORMS.map(platform => {
    const account = socialAccounts.value.find(acc => acc.platform.toLowerCase() === platform.key.toLowerCase());
    return {
      ...platform,
      account: account || null,
      isConnected: !!account,
    };
  }).sort((a, b) => {
    if (a.isConnected && !b.isConnected) return -1;
    if (!a.isConnected && b.isConnected) return 1;
    return 0;
  });
})

const totalPostsCount = computed(() => 0);

// Get API base URL from runtime config
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

// Use authentication composable
const { getAuthHeaders, isAuthenticated } = useAuth()

// Fetch social accounts for the profile
const fetchSocialAccounts = async () => {
  if (!props.profileId || !isAuthenticated.value) {
    error.value = 'Profile ID or authentication missing'
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

    const response = await $fetch(`${apiBase}/profiles/${props.profileId}/social-accounts`, {
      method: 'GET',
      headers
    }) as any

    if (response.status === 'success') {
      socialAccounts.value = response.data
      // Keep "All Channels" selected by default
      emit('accountSelected', null);
    } else {
      error.value = 'Failed to load social accounts'
    }
  } catch (err) {
    const httpError = err as { status?: number }
    if (httpError.status === 401) {
      error.value = 'Please log in to access accounts'
    } else if (httpError.status === 404) {
      error.value = 'Profile not found'
    } else {
      error.value = 'Failed to load social accounts'
    }
    socialAccounts.value = []
  } finally {
    loading.value = false
  }
}

// Select account
const selectAccount = (account: SocialAccount | null) => {
  selectedAccountId.value = account?.id || null;
  isAllChannelsSelected.value = false;
  // Emit the selected account to parent component
  emit('accountSelected', account);
}

// Select all channels
const selectAllChannels = () => {
  selectedAccountId.value = null;
  isAllChannelsSelected.value = true;
  // Emit null to show all channels view
  emit('accountSelected', null);
}

// Get initials from account name
const getAccountInitials = (name: string) => {
  if (!name) return ''
  const names = name.split(' ')
  if (names.length === 1) return names[0][0].toUpperCase()
  return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
}

// Watch for profileId changes
watch(() => props.profileId, () => {
  fetchSocialAccounts()
}, { immediate: true })

</script> 