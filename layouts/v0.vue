


<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <header class="bg-white border-b border-gray-200 px-6 py-0">
      <div class="flex items-center justify-between h-16">
        <!-- Left: Logo + Main Navigation -->
        <div class="flex items-center space-x-8">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span class="text-xl font-semibold text-gray-900">Postify</span>
          </div>
          
          <!-- Main Navigation Tabs -->
          <nav class="flex space-x-0">
            <NuxtLink to="/" class="px-4 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Publish
            </NuxtLink>
            <NuxtLink to="/create" class="px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
              Create
            </NuxtLink>
            <NuxtLink to="/engage" class="px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
              Engage
            </NuxtLink>
            <NuxtLink to="/analyze" class="px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
              Analyze
            </NuxtLink>
            <NuxtLink to="/kanban" class="px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
              Tasks
            </NuxtLink>
          </nav>
        </div>
        
        <!-- Right: Actions + Profile -->
        <div class="flex items-center space-x-4">
          <button class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            New
          </button>
          
          <!-- Profile -->
          <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Left Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
        <!-- Channels Section -->
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-semibold text-gray-900">Channels</h2>
            <button class="w-4 h-4 text-gray-400 hover:text-gray-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
          
          <!-- Channel List -->
          <div class="space-y-1">
            <div class="flex items-center justify-between p-2 rounded-lg bg-blue-50 text-blue-700">
              <div class="flex items-center space-x-3">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-xs font-medium">AC</span>
                </div>
                <span class="text-sm font-medium">All Channels</span>
              </div>
              <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">2</span>
            </div>
            
            <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <div class="flex items-center space-x-3">
                <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">@username</span>
              </div>
              <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">1</span>
            </div>
            
            <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <div class="flex items-center space-x-3">
                <div class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">Pinterest</span>
              </div>
              <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">1</span>
            </div>
          </div>
          
          <!-- Connect More -->
          <div class="mt-6 space-y-2">
            <button class="flex items-center space-x-3 p-2 w-full text-left rounded-lg hover:bg-gray-50">
              <div class="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <span class="text-sm text-gray-600">Connect Facebook</span>
            </button>
            
            <button class="flex items-center space-x-3 p-2 w-full text-left rounded-lg hover:bg-gray-50">
              <div class="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <span class="text-sm text-gray-600">Connect Instagram</span>
            </button>
            
            <button class="flex items-center space-x-3 p-2 w-full text-left rounded-lg hover:bg-gray-50">
              <div class="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <span class="text-sm text-gray-600">Connect LinkedIn</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
