<template>
  <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
    <Icon name="heroicons:clock" class="w-4 h-4 text-blue-500" />
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-900 dark:text-white truncate">{{ post.content }}</p>
      <div class="flex items-center justify-between mt-1">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ formatScheduledTime(post.scheduledTime) }}
        </p>
        <div class="flex -space-x-1">
          <PlatformIcon 
            v-for="platform in post.platforms" 
            :key="platform.id"
            :platform="platform.name" 
            size="sm" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/stores/posts'

interface Props {
  post: Post
}

defineProps<Props>()

const formatScheduledTime = (date: Date | null) => {
  if (!date) return ''
  
  const now = new Date()
  const scheduled = new Date(date)
  const diffInHours = (scheduled.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return `Today at ${scheduled.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })}`
  } else if (diffInHours < 48) {
    return `Tomorrow at ${scheduled.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })}`
  } else {
    return scheduled.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }
}
</script>
