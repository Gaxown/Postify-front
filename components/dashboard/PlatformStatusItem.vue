<template>
  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div class="flex items-center space-x-3">
      <PlatformIcon :platform="platform.name" size="sm" />
      <div>
        <span class="text-sm font-medium text-gray-900 dark:text-white capitalize">
          {{ platform.name }}
        </span>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ platform.characterLimit }} chars max
        </p>
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <div 
        :class="platform.isConnected ? 'bg-green-400' : 'bg-red-400'"
        class="w-2 h-2 rounded-full"
      />
      <span 
        :class="platform.isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
        class="text-xs font-medium"
      >
        {{ platform.isConnected ? 'Connected' : 'Disconnected' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Platform } from '~/stores/posts'

interface Props {
  platform: Platform
}

defineProps<Props>()
</script>
