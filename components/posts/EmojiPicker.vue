<template>
  <div class="flex items-center justify-start">
    <!-- Emoji Button -->
    <div class="relative">
      <button @click="showEmojiPicker = !showEmojiPicker" class="p-2 hover:bg-gray-100 rounded-lg">
        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </button>
      
      <!-- Vue3 Emoji Picker -->
      <div v-if="showEmojiPicker" class="absolute top-full left-0 mt-1 z-50">
        <EmojiPickerComponent
          :native="true"
          :hide-group-names="false"
          :hide-search="false"
          :theme="'light'"
          @select="onEmojiSelect"
          class="shadow-lg border border-gray-200 rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import EmojiPickerComponent from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

// Emits
const emit = defineEmits<{
  'emoji-selected': [emoji: string]
}>()

// State
const showEmojiPicker = ref(false)

// Methods
const onEmojiSelect = (emoji: any) => {
  const emojiChar = emoji.i
  showEmojiPicker.value = false
  emit('emoji-selected', emojiChar)
}

// Close emoji picker when clicking outside
const closeEmojiPicker = (event: Event) => {
  const target = event.target as Element
  if (!target?.closest('.relative')) {
    showEmojiPicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeEmojiPicker)
})

onUnmounted(() => {
  document.removeEventListener('click', closeEmojiPicker)
})
</script> 