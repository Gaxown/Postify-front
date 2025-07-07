<template>
  <div
    class="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <ProfileAvatar 
          :name="profile.name"
          :avatar="profile.avatar"
          :color="profile.color"
          size="md"
        />
        
        <!-- Edit button can be uncommented if needed -->
        <!-- <div class="flex items-center space-x-2">
          <button
            @click.stop="$emit('edit', profile)"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
          </button>
        </div> -->
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

      </div>

      <!-- Platform Icons -->
      <PlatformIcons :accounts="profile.accounts" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileAvatar from './ProfileAvatar.vue'
import PlatformIcons from './PlatformIcons.vue'

export interface Profile {
  name: string
  description: string
  avatar?: string
  color: string
  accounts: { platform: string }[]
}

interface Props {
  profile: Profile
}

defineProps<Props>()

// Plus d'emits
</script> 