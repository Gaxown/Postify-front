<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Sidebar -->
    <div 
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out',
        ui.isSidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0'
      ]"
    >
      <AppSidebar />
    </div>

    <!-- Mobile sidebar backdrop -->
    <div 
      v-if="!ui.isSidebarCollapsed"
      class="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
      @click="ui.setSidebarCollapsed(true)"
    />

    <!-- Main content -->
    <div 
      :class="[
        'transition-all duration-300 ease-in-out',
        ui.isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      ]"
    >
      <!-- Top navigation -->
      <AppHeader />
      
      <!-- Page content -->
      <main class="min-h-screen pt-16">
        <!-- Breadcrumbs -->
        <AppBreadcrumbs v-if="ui.breadcrumbs.length > 0" />
        
        <!-- Main content area -->
        <div class="px-4 sm:px-6 lg:px-8 py-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- Command Palette -->
    <CommandPalette />
    
    <!-- Floating Action Button -->
    <FloatingActionButton />
    
    <!-- Context Menu -->
    <ContextMenu />
    
    <!-- Notifications -->
    <NotificationToast />
    
    <!-- Text Selection Toolbar -->
    <TextSelectionToolbar />
  </div>
</template>

<script setup lang="ts">
const ui = useUIStore()

// Initialize UI state
onMounted(() => {
  ui.initialize()
})

// Handle keyboard shortcuts
onMounted(() => {
  ui.registerKeyboardShortcuts()
})

// Set responsive sidebar behavior
const { width } = useWindowSize()
watch(width, (newWidth) => {
  if (newWidth < 1024) {
    ui.setSidebarCollapsed(true)
  }
})
</script>
