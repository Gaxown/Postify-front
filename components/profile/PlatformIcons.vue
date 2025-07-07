<template>
  <div class="flex space-x-0.5">
    <div
      v-for="(account, index) in displayedAccounts"
      :key="index"
      class="w-8 h-8 flex items-center justify-center"
      :title="account.platform"
    >
      <!-- Facebook -->
      <Facebook v-if="account.platform === 'facebook'" class="w-4 h-4 text-blue-600" />
      
      <!-- Instagram -->
      <Instagram v-else-if="account.platform === 'instagram'" class="w-4 h-4 text-pink-600" />

      <!-- X (Twitter) -->
      <svg v-else-if="account.platform === 'twitter' || account.platform === 'x'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>

      <!-- LinkedIn -->
      <Linkedin v-else-if="account.platform === 'linkedin'" class="w-4 h-4 text-blue-700" />

      <!-- YouTube -->
      <Youtube v-else-if="account.platform === 'youtube'" class="w-4 h-4 text-red-600" />

      <!-- TikTok -->
      <svg v-else-if="account.platform === 'tiktok'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>

      <!-- Pinterest -->
      <svg v-else-if="account.platform === 'pinterest'" class="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.958 1.404-5.958s-.359-.719-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165C4.575 16.71 3.6 14.833 3.6 11.9c0-3.777 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.029 12.017 24.029c6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001 12.017.001z"/>
      </svg>

      <!-- Default for unknown platforms -->
      <div v-else class="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center">
        <span class="text-white text-xs font-bold">{{ account.platform.substring(0, 1).toUpperCase() }}</span>
      </div>
    </div>
    
    <!-- Show count if more than maxDisplay accounts -->
    <div
      v-if="accounts.length > maxDisplay"
      class="w-8 h-8 rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-600"
    >
      +{{ accounts.length - maxDisplay }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-vue-next'

const props = defineProps({
  accounts: {
    type: Array,
    required: true,
    default: () => []
  },
  maxDisplay: {
    type: Number,
    default: 5
  }
})

const displayedAccounts = computed(() => {
  return props.accounts.slice(0, props.maxDisplay)
})
</script> 