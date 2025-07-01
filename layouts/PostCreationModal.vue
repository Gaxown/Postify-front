<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Create Post</h2>
        <div class="relative">
          <button 
            @click="toggleTagsDropdown"
            class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Tags
            <ChevronDown class="w-4 h-4" />
          </button>
          <div v-if="showTagsDropdown" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div class="py-1">
              <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Technology</button>
              <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Business</button>
              <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Marketing</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-4">
        <!-- Profile Avatars -->
        <div class="flex items-center gap-3 mb-4">
          <div class="relative">
            <div class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold">
              G
            </div>
            <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Check class="w-3 h-3 text-white" />
            </div>
          </div>
          <div class="relative">
            <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              C
            </div>
            <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <Check class="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        <!-- Text Area -->
        <div class="mb-6">
          <div class="relative">
            <textarea
              v-model="postContent"
              @focus="showPlaceholder = false"
              @blur="showPlaceholder = postContent.length === 0"
              class="w-full min-h-[200px] p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :placeholder="showPlaceholder ? '' : 'What\'s on your mind?'"
            ></textarea>
            <div v-if="showPlaceholder && postContent.length === 0" class="absolute top-4 left-4 pointer-events-none">
              <span class="text-gray-500">Start writing or </span>
              <button 
                @click="useAIAssistant"
                class="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 pointer-events-auto"
              >
                <Wand2 class="w-4 h-4" />
                Use the AI Assistant
              </button>
            </div>
          </div>
        </div>

        <!-- File Upload Area -->
        <div class="mb-6">
          <div 
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            :class="{ 'border-blue-500 bg-blue-50': isDragging }"
          >
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <Image class="w-6 h-6 text-gray-400" />
              </div>
              <p class="text-gray-600">
                Drag & drop or 
                <button 
                  @click="selectFile"
                  class="text-blue-600 hover:text-blue-700 underline"
                >
                  select a file
                </button>
              </p>
            </div>
          </div>
          <input 
            ref="fileInput"
            type="file"
            @change="handleFileSelect"
            class="hidden"
            accept="image/*,video/*"
            multiple
          />
        </div>

        <!-- Bottom Toolbar -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <button 
              @click="selectFile"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Add media"
            >
              <ImageIcon class="w-5 h-5" />
            </button>
            <button 
              @click="toggleEmojiPicker"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Add emoji"
            >
              <Smile class="w-5 h-5" />
            </button>
            <button 
              @click="useAIAssistant"
              class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Wand2 class="w-4 h-4" />
              AI Assistant
            </button>
          </div>
        </div>

        <!-- Customize Button -->
        <div class="flex justify-end">
          <button 
            @click="customizeForNetworks"
            class="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            Customize for each network
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  ChevronDown, 
  Check, 
  Wand2, 
  Image, 
  Image as ImageIcon, 
  Smile, 
  ArrowRight 
} from 'lucide-vue-next'

// Reactive data
const postContent = ref('')
const showPlaceholder = ref(true)
const showTagsDropdown = ref(false)
const isDragging = ref(false)
const fileInput = ref(null)

// Methods
const toggleTagsDropdown = () => {
  showTagsDropdown.value = !showTagsDropdown.value
}

const useAIAssistant = () => {
  console.log('Opening AI Assistant...')
  // Implement AI assistant functionality
}

const selectFile = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  console.log('Selected files:', files)
  // Handle file selection
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files)
  console.log('Dropped files:', files)
  // Handle dropped files
}

const toggleEmojiPicker = () => {
  console.log('Opening emoji picker...')
  // Implement emoji picker functionality
}

const customizeForNetworks = () => {
  console.log('Customizing for each network...')
  // Implement network customization
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showTagsDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Additional custom styles if needed */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>