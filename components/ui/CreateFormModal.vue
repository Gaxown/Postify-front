<template>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
    <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4" @click.stop>
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        {{ type === 'profile' ? 'Create New Profile' : 'Create New Team' }}
      </h3>
      
      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ type === 'profile' ? 'Company Name' : 'Team Name' }}
          </label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="type === 'profile' ? 'Enter company name' : 'Enter team name'"
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="type === 'profile' ? 'Brief description of the company' : 'Describe your team\'s purpose'"
          ></textarea>
        </div>

        <!-- Avatar Upload - Only for profiles -->
        <div v-if="type === 'profile'" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
          <div class="flex items-center space-x-4">
            <!-- Avatar Preview -->
            <div class="border-2 border-gray-200 rounded-full">
              <ProfileAvatar 
                :name="formData.name || 'New Profile'"
                :avatar="formData.avatar"
                :color="formData.color"
                size="lg"
              />
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
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ type === 'profile' ? 'Color' : 'Team Color' }}
          </label>
          <div class="flex space-x-2">
            <div
              v-for="color in colors"
              :key="color"
              @click="formData.color = color"
              :class="[
                'w-8 h-8 rounded-lg cursor-pointer border-2 transition-all',
                formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
              ]"
              :style="{ backgroundColor: color }"
            ></div>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ type === 'profile' ? 'Creating...' : 'Creating...' }}
            </span>
            <span v-else>{{ type === 'profile' ? 'Create Profile' : 'Create Team' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ProfileAvatar from '@/components/profile/ProfileAvatar.vue'

// Props - ce que le composant reçoit de l'extérieur
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  type: {
    type: String, // 'profile' ou 'team'
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

// Events - ce que le composant envoie vers l'extérieur
const emit = defineEmits(['close', 'submit'])

// Données du formulaire
const formData = ref({
  name: '',
  description: '',
  color: '#8B5CF6',
  avatar: ''
})

// Référence pour l'input file
const avatarInput = ref(null)

// Couleurs disponibles
const colors = [
  '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'
]

// Fonctions
const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    color: '#8B5CF6',
    avatar: ''
  }
}

const handleSubmit = () => {
  // Envoyer les données du formulaire au parent
  emit('submit', formData.value)
}

const triggerFileInput = () => {
  avatarInput.value?.click()
}

const handleAvatarUpload = (event) => {
  const file = event.target.files?.[0]
  
  if (file) {
    // Vérifier la taille (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }
    
    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    // Créer l'aperçu
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.avatar = e.target?.result
    }
    reader.readAsDataURL(file)
  }
}

// Réinitialiser le formulaire quand le modal se ferme
watch(() => props.showModal, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})
</script> 