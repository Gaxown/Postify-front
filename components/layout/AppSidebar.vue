<template>
  <div class="h-full bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
    <!-- Logo and brand -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div v-if="!ui.isSidebarCollapsed" class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Icon name="heroicons:rocket-launch" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Postify</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">Smart Scheduler</p>
        </div>
      </div>
      <div v-else class="flex justify-center w-full">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Icon name="heroicons:rocket-launch" class="w-5 h-5 text-white" />
        </div>
      </div>
    </div>

    <!-- Navigation menu -->
    <nav class="mt-6 px-3">
      <div class="space-y-1">
        <SidebarLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          :icon="item.icon"
          :name="item.name"
          :badge="item.badge"
          :collapsed="ui.isSidebarCollapsed"
        />
      </div>

      <!-- Consistency Streak -->
      <div v-if="!ui.isSidebarCollapsed" class="mt-8 px-3">
        <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:fire" class="w-6 h-6 text-orange-500 streak-flame" />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ posts.consistencyStreak }} Day Streak!
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Keep posting daily
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Connected platforms -->
      <div v-if="!ui.isSidebarCollapsed" class="mt-6">
        <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Connected Platforms
        </h3>
        <div class="mt-3 space-y-1">
          <div
            v-for="platform in posts.platforms"
            :key="platform.id"
            class="flex items-center justify-between px-3 py-2 text-sm rounded-lg"
            :class="platform.isConnected ? 
              'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 
              'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'"
          >
            <div class="flex items-center space-x-2">
              <PlatformIcon :platform="platform.name" class="w-4 h-4" />
              <span class="capitalize">{{ platform.name }}</span>
            </div>
            <div 
              :class="platform.isConnected ? 'bg-green-400' : 'bg-gray-300'"
              class="w-2 h-2 rounded-full"
            />
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div v-if="!ui.isSidebarCollapsed" class="mt-8 px-3">
        <UButton
          @click="navigateTo('/compose')"
          class="w-full gradient-primary text-white"
          size="sm"
        >
          <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
          New Post
        </UButton>
      </div>
    </nav>

    <!-- Collapse toggle -->
    <div class="absolute bottom-4 left-4 right-4">
      <UButton
        @click="ui.toggleSidebar()"
        variant="ghost"
        size="sm"
        class="w-full"
      >
        <Icon 
          :name="ui.isSidebarCollapsed ? 'heroicons:chevron-right' : 'heroicons:chevron-left'" 
          class="w-4 h-4" 
        />
        <span v-if="!ui.isSidebarCollapsed" class="ml-2">Collapse</span>
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const ui = useUIStore()
const posts = usePostsStore()
const route = useRoute()

const navigation = computed(() => [
  {
    name: 'Dashboard',
    to: '/',
    icon: 'heroicons:home',
    current: route.path === '/'
  },
  {
    name: 'Compose',
    to: '/compose',
    icon: 'heroicons:pencil-square',
    current: route.path === '/compose'
  },
  {
    name: 'Calendar',
    to: '/calendar',
    icon: 'heroicons:calendar-days',
    current: route.path === '/calendar',
    badge: posts.scheduledPosts.length > 0 ? posts.scheduledPosts.length : undefined
  },
  {
    name: 'Analytics',
    to: '/analytics',
    icon: 'heroicons:chart-bar-square',
    current: route.path === '/analytics'
  },
  {
    name: 'Posts',
    to: '/posts',
    icon: 'heroicons:document-text',
    current: route.path === '/posts',
    badge: posts.posts.filter(p => p.status === 'draft').length > 0 ? 
           posts.posts.filter(p => p.status === 'draft').length : undefined
  }
])
</script>
