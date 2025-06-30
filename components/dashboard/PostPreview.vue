<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Icon name="heroicons:document-text" class="w-5 h-5 text-white" />
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-900 dark:text-white line-clamp-2">{{ post.content }}</p>
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center space-x-2">
            <UBadge 
              :label="post.status" 
              :color="statusColor" 
              size="xs"
            />
            <div class="flex -space-x-1">
              <PlatformIcon 
                v-for="platform in post.platforms" 
                :key="platform.id"
                :platform="platform.name" 
                size="sm" 
              />
            </div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDate(post.updatedAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/stores/posts'

interface Props {
  post: Post
  compact?: boolean
}

const props = defineProps<Props>()

const statusColor = computed(() => {
  switch (props.post.status) {
    case 'published': return 'green'
    case 'scheduled': return 'blue'
    case 'draft': return 'gray'
    case 'failed': return 'red'
    default: return 'gray'
  }
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>
