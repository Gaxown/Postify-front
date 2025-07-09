<template>
  <div class="flex items-center space-x-3">
    <!-- Platform Icon -->
    <div class="w-8 h-8 flex items-center justify-center">
      <PlatformIcon :platform="selectedPlatform.icon" class="w-6 h-6" />
    </div>

    <!-- Platform Dropdown -->
    <div class="relative">
      <button @click="showDropdown = !showDropdown" class="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
        <span>{{ selectedPlatform.name }}</span>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div v-if="showDropdown" class="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
        <div class="py-1">
          <button
            v-for="platform in platforms"
            :key="platform.id"
            @click="selectPlatform(platform)"
            class="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            :class="{ 'bg-blue-50': selectedPlatform.id === platform.id }"
          >
            <div class="w-6 h-6 flex items-center justify-center">
              <PlatformIcon :platform="platform.icon" class="w-5 h-5" />
            </div>
            <span>{{ platform.name }}</span>
            <svg v-if="selectedPlatform.id === platform.id" class="w-4 h-4 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, watch, onMounted, onUnmounted } from 'vue'
import PlatformIcon from '~/components/ui/PlatformIcon.vue'

// Platform interface
interface Platform {
  id: string
  name: string
  color: string
  icon: string
  postTypes: string[]
}

// Available platforms
const platforms = ref<Platform[]>([
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    icon: 'facebook',
    postTypes: ['post']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    icon: 'instagram',
    postTypes: ['post', 'reel']
  },
  {
    id: 'twitter',
    name: 'Twitter',
    color: '#1DA1F2',
    icon: 'twitter',
    postTypes: ['post']
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    icon: 'linkedin',
    postTypes: ['post']
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#000000',
    icon: 'tiktok',
    postTypes: ['reel']
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    icon: 'youtube',
    postTypes: ['reel']
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    color: '#BD081C',
    icon: 'pinterest',
    postTypes: ['post']
  }
])

// Props
const props = defineProps<{
  modelValue?: string
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'platform-changed': [platform: Platform]
}>()

// State
const showDropdown = ref(false)
const selectedPlatformId = ref(props.modelValue || 'facebook')

// Computed
const selectedPlatform = computed(() => {
  return platforms.value.find(p => p.id === selectedPlatformId.value) || platforms.value[0]
})

// Methods
const selectPlatform = (platform: Platform) => {
  selectedPlatformId.value = platform.id
  showDropdown.value = false
  emit('update:modelValue', platform.id)
  emit('platform-changed', platform)
}

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedPlatformId.value = newValue
  }
})

// Close dropdown when clicking outside
const closeDropdown = (event: Event) => {
  if (!(event.target as Element)?.closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
/* Additional styles if needed */
</style> 