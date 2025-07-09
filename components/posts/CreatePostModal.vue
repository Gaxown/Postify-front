<template>
  <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
    
    <!-- Modal -->
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="relative bg-white rounded-xl shadow-xl max-w-lg w-full" @click.stop>
        
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Create Post</h2>
          <div class="flex items-center space-x-3">
            <TagsSelector 
              v-model="selectedTags"
              @tags-changed="onTagsChanged"
            />
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4 space-y-4">
          <!-- Platform and Post Type -->
          <div class="flex items-center justify-between">
            <!-- Platform Selector -->
            <PlatformSelector 
              v-model="selectedPlatform" 
              @platform-changed="onPlatformChanged"
            />

            <!-- Post Type Radio Buttons -->
            <div class="flex items-center space-x-4">
              <label v-for="postType in availablePostTypes" :key="postType" class="flex items-center">
                <input 
                  type="radio" 
                  v-model="selectedPostType" 
                  :value="postType" 
                  class="w-3 h-3 text-blue-600 focus:ring-blue-500"
                >
                <span class="ml-1.5 text-sm font-medium" 
                      :class="selectedPostType === postType ? 'text-gray-900' : 'text-gray-700'">
                  {{ postType.charAt(0).toUpperCase() + postType.slice(1) }}
                </span>
              </label>
            </div>
          </div>

          <!-- Text Area -->
          <div class="relative">
            <textarea
              v-model="postContent"
              :rows="textAreaRows"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              :placeholder="placeholderText"
              :maxlength="maxLength"
              ref="textareaRef"
            ></textarea>
            
            <!-- Character Count -->
            <div class="absolute bottom-2 right-3 text-xs text-gray-400">
              {{ postContent.length }}/{{ maxLength }}
            </div>
          </div>

          <!-- Emoji Picker -->
          <EmojiPicker 
            @emoji-selected="onEmojiSelected"
          />

          <!-- Media Upload Area -->
          <MediaUploader 
            :post-type="selectedPostType"
            v-model="uploadedFiles"
            @files-changed="onFilesChanged"
          />


        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between p-4 border-t border-gray-200">
          <!-- Schedule Time -->
          <div class="flex items-center space-x-2">
            <button @click="showDatePicker = !showDatePicker" class="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span class="text-sm font-medium">{{ formatScheduledTime }}</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Date/Time Picker Dropdown -->
            <div v-if="showDatePicker" class="absolute bottom-16 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10">
              <div class="space-y-2">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input
                    v-model="scheduleDate"
                    type="date"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    :min="today"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Time</label>
                  <input
                    v-model="scheduleTime"
                    type="time"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button @click="showDatePicker = false" class="w-full px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                  Done
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-2">
            <button class="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <span>Schedule Draft</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <button class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm">
              Schedule Post
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PlatformSelector from '~/components/posts/PlatformSelector.vue'
import MediaUploader from '~/components/posts/MediaUploader.vue'
import EmojiPicker from '~/components/posts/EmojiPicker.vue'
import TagsSelector from '~/components/posts/TagsSelector.vue'

interface Platform {
  id: string
  name: string
  color: string
  icon: any
  postTypes: string[]
}

interface UploadedFile {
  url: string
  file: File
  name: string
  type: 'image' | 'video'
}

const showModal = ref(false)
const selectedPlatform = ref('facebook')
const selectedPostType = ref<'post' | 'reel'>('post')
const postContent = ref('')
const showDatePicker = ref(false)
const scheduleDate = ref('')
const scheduleTime = ref('')
const selectedTags = ref<number[]>([])
const uploadedFiles = ref<UploadedFile[]>([])
const currentPlatform = ref<Platform | null>(null)
const textareaRef = ref<HTMLTextAreaElement>()

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const maxLength = computed(() => {
  return selectedPostType.value === 'reel' ? 150 : 2200
})

const textAreaRows = computed(() => {
  return selectedPostType.value === 'reel' ? 3 : 4
})

const placeholderText = computed(() => {
  if (selectedPostType.value === 'reel') {
    return 'Write a catchy caption for your reel...'
  }
  return 'What\'s on your mind? Share your thoughts...'
})

const formatScheduledTime = computed(() => {
  if (scheduleDate.value && scheduleTime.value) {
    const date = new Date(`${scheduleDate.value}T${scheduleTime.value}`)
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const day = date.getDate()
    const time = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
    return `${month} ${day}, ${time}`
  } else {
    const date = new Date()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const day = date.getDate()
    const time = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
    return `${month} ${day}, ${time}`
  }
})



const availablePostTypes = computed(() => {
  return currentPlatform.value?.postTypes || ['post', 'reel', 'story']
})

const hasVideoFile = computed(() => {
  return uploadedFiles.value.some(file => file.type === 'video')
})



const onTagsChanged = (tags: any[]) => {
  // Handle tags change if needed
}

const onPlatformChanged = (platform: Platform) => {
  currentPlatform.value = platform
  // Reset post type to first available type for this platform
  if (platform.postTypes.length > 0) {
    selectedPostType.value = platform.postTypes[0] as 'post' | 'reel'
  }
}

const onFilesChanged = (files: UploadedFile[]) => {
  uploadedFiles.value = files
}

const onContentChanged = (content: string) => {
  postContent.value = content
}

const onEmojiSelected = (emoji: string) => {
  // Get current cursor position
  const textarea = textareaRef.value
  if (textarea) {
    const start = textarea.selectionStart || 0
    const end = textarea.selectionEnd || 0
    
    // Insert emoji at cursor position
    const beforeCursor = postContent.value.slice(0, start)
    const afterCursor = postContent.value.slice(end)
    
    postContent.value = beforeCursor + emoji + afterCursor
    
    // Set cursor position after emoji
    const newCursorPos = start + emoji.length
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  } else {
    // Fallback: append to end
    postContent.value += emoji
  }
}

const openModal = () => {
  showModal.value = true
  // Set default date/time to now
  const now = new Date()
  scheduleDate.value = now.toISOString().split('T')[0]
  scheduleTime.value = now.toTimeString().slice(0, 5)
}

const closeModal = () => {
  showModal.value = false
  showDatePicker.value = false
  selectedPostType.value = 'post'
  postContent.value = ''
  scheduleDate.value = ''
  scheduleTime.value = ''
  selectedTags.value = []
  uploadedFiles.value.forEach(file => URL.revokeObjectURL(file.url))
  uploadedFiles.value = []
}

// Expose the openModal function
defineExpose({
  openModal
})
</script> 