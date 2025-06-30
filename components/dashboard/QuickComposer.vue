<template>
  <div class="space-y-4">
    <UTextarea 
      v-model="content"
      placeholder="What's on your mind?" 
      rows="3" 
      @input="checkCharacterLimit"
    />
    
    <!-- Platform selection -->
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="platform in posts.connectedPlatforms"
        :key="platform.id"
        :variant="selectedPlatforms.includes(platform.id) ? 'solid' : 'outline'"
        size="xs"
        @click="togglePlatform(platform.id)"
      >
        <PlatformIcon :platform="platform.name" size="sm" class="mr-1" />
        {{ platform.name }}
      </UButton>
    </div>
    
    <!-- Character count -->
    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center space-x-2">
        <span 
          :class="[
            'font-medium',
            characterCount > characterLimit ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
          ]"
        >
          {{ characterCount }}/{{ characterLimit }}
        </span>
        <div 
          v-if="characterCount > characterLimit"
          class="w-2 h-2 bg-red-500 rounded-full animate-pulse"
        />
      </div>
    </div>
    
    <div class="flex justify-between items-center">
      <div class="flex space-x-2">
        <UButton variant="ghost" size="sm">
          <Icon name="heroicons:photo" class="w-4 h-4" />
        </UButton>
        <UButton variant="ghost" size="sm">
          <Icon name="heroicons:calendar" class="w-4 h-4" />
        </UButton>
        <UButton variant="ghost" size="sm">
          <Icon name="heroicons:face-smile" class="w-4 h-4" />
        </UButton>
      </div>
      
      <div class="flex space-x-2">
        <UButton 
          @click="saveDraft"
          variant="outline" 
          size="sm"
          :disabled="!content.trim()"
        >
          Save Draft
        </UButton>
        <UButton 
          @click="publish"
          size="sm" 
          class="gradient-primary text-white"
          :disabled="!content.trim() || selectedPlatforms.length === 0 || characterCount > characterLimit"
        >
          Post Now
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const posts = usePostsStore()
const ui = useUIStore()

const content = ref('')
const selectedPlatforms = ref<string[]>([])

// Character limit based on selected platforms
const characterLimit = computed(() => {
  if (selectedPlatforms.value.length === 0) return 280
  
  const platformNames = selectedPlatforms.value.map(id => {
    const platform = posts.platforms.find(p => p.id === id)
    return platform?.name || ''
  }).filter(Boolean)
  
  return posts.getPlatformCharacterLimit(platformNames)
})

const characterCount = computed(() => content.value.length)

// Select first connected platform by default
onMounted(() => {
  const firstConnected = posts.connectedPlatforms[0]
  if (firstConnected) {
    selectedPlatforms.value = [firstConnected.id]
  }
})

const togglePlatform = (platformId: string) => {
  const index = selectedPlatforms.value.indexOf(platformId)
  if (index === -1) {
    selectedPlatforms.value.push(platformId)
  } else {
    selectedPlatforms.value.splice(index, 1)
  }
}

const checkCharacterLimit = () => {
  // Trigger haptic feedback when approaching limit
  if (characterCount.value > characterLimit.value * 0.9) {
    ui.triggerHapticFeedback('light')
  }
}

const saveDraft = () => {
  const selectedPlatformObjects = posts.platforms.filter(p => 
    selectedPlatforms.value.includes(p.id)
  )
  
  posts.createPost({
    content: content.value,
    platforms: selectedPlatformObjects,
    status: 'draft'
  })
  
  ui.showNotification({
    type: 'success',
    title: 'Draft Saved',
    message: 'Your post has been saved as a draft'
  })
  
  // Reset form
  content.value = ''
}

const publish = () => {
  const selectedPlatformObjects = posts.platforms.filter(p => 
    selectedPlatforms.value.includes(p.id)
  )
  
  const newPost = posts.createPost({
    content: content.value,
    platforms: selectedPlatformObjects,
    status: 'published',
    publishedTime: new Date()
  })
  
  ui.showNotification({
    type: 'success',
    title: 'Posted Successfully!',
    message: 'Your post has been published'
  })
  
  // Reset form
  content.value = ''
  
  // Trigger confetti effect
  ui.triggerConfetti()
}
</script>
