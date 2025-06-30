<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <!-- Left side - Mobile menu toggle -->
      <div class="flex items-center space-x-4">
        <UButton
          @click="ui.toggleSidebar()"
          variant="ghost"
          size="sm"
          class="lg:hidden"
        >
          <Icon name="heroicons:bars-3" class="w-5 h-5" />
        </UButton>
        
        <!-- Search -->
        <div class="hidden sm:block">
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <UInput
              v-model="searchQuery"
              placeholder="Search posts... (⌘K)"
              class="pl-10 w-64 lg:w-80"
              @focus="ui.openCommandPalette()"
            />
          </div>
        </div>
      </div>

      <!-- Right side - Actions -->
      <div class="flex items-center space-x-3">
        <!-- Theme toggle -->
        <UButton
          @click="ui.toggleTheme()"
          variant="ghost"
          size="sm"
          class="p-2"
        >
          <Icon 
            :name="ui.isDarkMode ? 'heroicons:sun' : 'heroicons:moon'" 
            class="w-5 h-5"
          />
        </UButton>

        <!-- Notifications -->
        <UButton
          variant="ghost"
          size="sm"
          class="p-2 relative"
        >
          <Icon name="heroicons:bell" class="w-5 h-5" />
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            {{ posts.upcomingPosts.length }}
          </span>
        </UButton>

        <!-- Command palette trigger -->
        <UButton
          @click="ui.openCommandPalette()"
          variant="ghost"
          size="sm"
          class="hidden sm:flex items-center space-x-2 p-2"
        >
          <Icon name="heroicons:command-line" class="w-4 h-4" />
          <span class="text-sm">⌘/</span>
        </UButton>

        <!-- Profile -->
        <UDropdown>
          <template #trigger>
            <UButton variant="ghost" class="p-1">
              <UAvatar
                src="/api/placeholder/32/32"
                alt="Profile"
                size="sm"
              />
            </UButton>
          </template>
          
          <div class="p-2">
            <UButton variant="ghost" size="sm" class="w-full justify-start mb-1">
              <Icon name="heroicons:user" class="w-4 h-4 mr-2" />
              Profile
            </UButton>
            <UButton variant="ghost" size="sm" class="w-full justify-start mb-1">
              <Icon name="heroicons:cog-6-tooth" class="w-4 h-4 mr-2" />
              Settings
            </UButton>
            <UButton variant="ghost" size="sm" class="w-full justify-start text-red-600">
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
              Sign out
            </UButton>
          </div>
        </UDropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const ui = useUIStore()
const posts = usePostsStore()

const searchQuery = ref('')

watch(searchQuery, (newQuery) => {
  posts.setSearchQuery(newQuery)
})
</script>
