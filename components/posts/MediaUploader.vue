<template>
  <div class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
    <input
      type="file"
      ref="fileInput"
      @change="handleFileUpload"
      :accept="acceptedFileTypes"
      :multiple="allowMultiple"
      class="hidden"
    />
    
    <!-- Empty State -->
    <div v-if="uploadedFiles.length === 0" @click="fileInput?.click()" class="cursor-pointer">
      <div class="w-12 h-12 bg-gray-100 rounded-lg mx-auto flex items-center justify-center mb-3">
        <svg v-if="postType === 'reel'" class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
      <p class="text-sm text-gray-500 mb-1">
        {{ postType === 'reel' ? 'Add video or photo' : 'Add photos or video' }}
      </p>
      <p class="text-xs text-gray-400">
        {{ postType === 'reel' ? 'Supports: MP4, MOV, AVI, JPG, PNG' : 'Supports: JPG, PNG, MP4, MOV, AVI and more' }}
      </p>
    </div>

    <!-- Files Preview -->
    <div v-else>
      <!-- Single File (Reel) -->
      <div v-if="postType === 'reel' && uploadedFiles.length > 0" class="relative">
        <div v-if="uploadedFiles[0].type === 'video'" class="relative">
          <video 
            :src="uploadedFiles[0].url" 
            class="w-full max-h-64 object-cover rounded-lg"
            controls
            preload="metadata"
          >
          </video>
          <div class="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            Video
          </div>
        </div>
        <div v-else class="relative">
          <img 
            :src="uploadedFiles[0].url" 
            :alt="uploadedFiles[0].name" 
            class="w-full max-h-64 object-cover rounded-lg"
          >
        </div>
        <button
          @click="removeFile(0)"
          class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
        >
          ×
        </button>
        <button
          @click="fileInput?.click()"
          class="absolute bottom-2 right-2 bg-white border border-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-gray-50"
        >
          Change
        </button>
      </div>

      <!-- Multiple Files (Post) -->
      <div v-else class="grid grid-cols-3 gap-2">
        <div v-for="(file, index) in uploadedFiles" :key="index" class="relative">
          <div v-if="file.type === 'video'" class="relative">
            <video 
              :src="file.url" 
              class="w-full h-20 object-cover rounded-lg"
              preload="metadata"
            >
            </video>
            <div class="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <img v-else :src="file.url" :alt="file.name" class="w-full h-20 object-cover rounded-lg">
          <button
            @click="removeFile(index)"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
        
        <!-- Add More Button -->
        <button
          v-if="uploadedFiles.length < maxFiles"
          @click="fileInput?.click()"
          class="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400"
        >
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Drag and Drop Overlay -->
    <div
      v-if="isDragging"
      class="absolute inset-0 bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg flex items-center justify-center"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      @dragleave="isDragging = false"
    >
      <div class="text-center">
        <svg class="w-8 h-8 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
        <p class="text-blue-600 font-medium">Drop files here</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, watch, onMounted, onUnmounted } from 'vue'

interface UploadedFile {
  url: string
  file: File
  name: string
  type: 'image' | 'video'
}

// Props
const props = defineProps<{
  postType: 'post' | 'reel'
  modelValue?: UploadedFile[]
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [files: UploadedFile[]]
  'files-changed': [files: UploadedFile[]]
}>()

// State
const fileInput = ref<HTMLInputElement>()
const uploadedFiles = ref<UploadedFile[]>(props.modelValue || [])
const isDragging = ref(false)

// Computed
const acceptedFileTypes = computed(() => {
  const imageTypes = '.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg'
  const videoTypes = '.mp4,.mov,.avi,.wmv,.flv,.webm,.mkv,.m4v,.3gp,.mpg,.mpeg'
  
  if (props.postType === 'reel') {
    return `${imageTypes},${videoTypes},image/*,video/*`
  }
  return `${imageTypes},${videoTypes},image/*,video/*`
})

const allowMultiple = computed(() => {
  return props.postType === 'post'
})

const maxFiles = computed(() => {
  return props.postType === 'post' ? 10 : 1
})

// Methods
const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    processFiles(Array.from(files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = event.dataTransfer?.files
  if (files) {
    processFiles(Array.from(files))
  }
}

const processFiles = (files: File[]) => {
  const invalidFiles: string[] = []
  
  files.forEach(file => {
    if (isValidFile(file)) {
      // For reels, replace the existing file
      if (props.postType === 'reel') {
        // Clear existing files first
        uploadedFiles.value.forEach(existingFile => {
          URL.revokeObjectURL(existingFile.url)
        })
        uploadedFiles.value = []
      }
      
      // Check if we've reached the limit
      if (uploadedFiles.value.length >= maxFiles.value) {
        return
      }
      
      const url = URL.createObjectURL(file)
      // Better file type detection
      let fileType: 'image' | 'video' = 'image'
      if (file.type.startsWith('video/') || 
          ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv', '.m4v', '.3gp', '.mpg', '.mpeg'].some(ext => 
            file.name.toLowerCase().endsWith(ext))) {
        fileType = 'video'
      }
      
      uploadedFiles.value.push({
        url,
        file,
        name: file.name,
        type: fileType
      })
    } else {
      invalidFiles.push(file.name)
    }
  })
  
  // Show error for invalid files
  if (invalidFiles.length > 0) {
    // You can emit an error event here if needed
  }
  
  updateModel()
}

const isValidFile = (file: File): boolean => {
  const validImageTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 
    'image/bmp', 'image/svg+xml', 'image/tiff'
  ]
  
  const validVideoTypes = [
    'video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/flv',
    'video/webm', 'video/mkv', 'video/m4v', 'video/3gp', 'video/mpg',
    'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'
  ]
  
  // Additional check by file extension if MIME type is not recognized
  const fileName = file.name.toLowerCase()
  const validImageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.tiff']
  const validVideoExts = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv', '.m4v', '.3gp', '.mpg', '.mpeg']
  
  const isValidByType = [...validImageTypes, ...validVideoTypes].includes(file.type)
  const isValidByExt = [...validImageExts, ...validVideoExts].some(ext => fileName.endsWith(ext))
  
  // Check if file type starts with image/ or video/ (for broader support)
  const isGeneralImageOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/')
  
  return isValidByType || isValidByExt || isGeneralImageOrVideo
}

const removeFile = (index: number) => {
  URL.revokeObjectURL(uploadedFiles.value[index].url)
  uploadedFiles.value.splice(index, 1)
  updateModel()
}

const updateModel = () => {
  emit('update:modelValue', uploadedFiles.value)
  emit('files-changed', uploadedFiles.value)
}

// Drag and drop events
const setupDragAndDrop = () => {
  const container = fileInput.value?.parentElement
  if (!container) return
  
  container.addEventListener('dragenter', (e) => {
    e.preventDefault()
    isDragging.value = true
  })
  
  container.addEventListener('dragleave', (e) => {
    e.preventDefault()
    if (!container.contains(e.relatedTarget as Node)) {
      isDragging.value = false
    }
  })
}

// Cleanup
const cleanup = () => {
  uploadedFiles.value.forEach(file => {
    URL.revokeObjectURL(file.url)
  })
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    uploadedFiles.value = newValue
  }
})

watch(() => props.postType, () => {
  // When post type changes, clear files if switching to reel and have multiple files
  if (props.postType === 'reel' && uploadedFiles.value.length > 1) {
    // Keep only the first file
    const firstFile = uploadedFiles.value[0]
    uploadedFiles.value.slice(1).forEach(file => {
      URL.revokeObjectURL(file.url)
    })
    uploadedFiles.value = firstFile ? [firstFile] : []
    updateModel()
  }
})

onMounted(() => {
  setupDragAndDrop()
})

onUnmounted(() => {
  cleanup()
})
</script> 