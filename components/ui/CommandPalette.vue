<template>
  <Teleport to="body">
    <div 
      v-if="ui.isCommandPaletteOpen"
      class="command-palette"
      @click.self="ui.closeCommandPalette()"
    >
      <div 
        class="command-palette-content"
        v-motion
        :initial="{ opacity: 0, scale: 0.95, y: -20 }"
        :visible="{ opacity: 1, scale: 1, y: 0 }"
      >
        <!-- Search input -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Type a command or search..."
              class="w-full pl-10 pr-4 py-3 border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 text-lg"
              @keydown.down.prevent="highlightNext"
              @keydown.up.prevent="highlightPrevious"
              @keydown.enter.prevent="executeHighlighted"
              @keydown.escape="ui.closeCommandPalette()"
            />
          </div>
        </div>

        <!-- Commands list -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="filteredCommands.length === 0" class="p-8 text-center">
            <Icon name="heroicons:magnifying-glass" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400">No commands found</p>
          </div>

          <div v-else class="py-2">
            <div v-for="(group, groupName) in groupedCommands" :key="groupName" class="mb-4">
              <div class="px-4 py-2">
                <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ groupName }}
                </h3>
              </div>
              
              <div class="space-y-1 px-2">
                <button
                  v-for="(command, index) in group"
                  :key="command.id"
                  :class="[
                    'w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors duration-150',
                    highlightedIndex === getCommandIndex(command) 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  ]"
                  @click="executeCommand(command)"
                  @mouseenter="highlightedIndex = getCommandIndex(command)"
                >
                  <Icon 
                    v-if="command.icon" 
                    :name="command.icon" 
                    :class="[
                      'w-5 h-5 mr-3',
                      highlightedIndex === getCommandIndex(command) ? 'text-white' : 'text-gray-400'
                    ]" 
                  />
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{{ command.title }}</span>
                      <kbd 
                        v-if="command.shortcut"
                        :class="[
                          'ml-auto text-xs px-2 py-1 rounded border',
                          highlightedIndex === getCommandIndex(command) 
                            ? 'bg-blue-400 border-blue-300 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                        ]"
                      >
                        {{ command.shortcut }}
                      </kbd>
                    </div>
                    <p 
                      v-if="command.description" 
                      :class="[
                        'text-sm mt-1',
                        highlightedIndex === getCommandIndex(command) ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      ]"
                    >
                      {{ command.description }}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-1">
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↑↓</kbd>
                <span>to navigate</span>
              </div>
              <div class="flex items-center space-x-1">
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↵</kbd>
                <span>to select</span>
              </div>
              <div class="flex items-center space-x-1">
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">esc</kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const ui = useUIStore()

const searchQuery = ref('')
const highlightedIndex = ref(0)
const searchInput = ref<HTMLInputElement>()

// Focus input when palette opens
watch(() => ui.isCommandPaletteOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    searchQuery.value = ''
    highlightedIndex.value = 0
  }
})

// Filter commands based on search query
const filteredCommands = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) {
    return ui.availableCommands
  }
  
  return ui.availableCommands.filter(command => 
    command.title.toLowerCase().includes(query) ||
    command.description?.toLowerCase().includes(query) ||
    command.group?.toLowerCase().includes(query)
  )
})

// Group commands by category
const groupedCommands = computed(() => {
  const groups: Record<string, typeof filteredCommands.value> = {}
  
  filteredCommands.value.forEach(command => {
    const group = command.group || 'Other'
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(command)
  })
  
  return groups
})

// Get flat command index for highlighting
const getCommandIndex = (targetCommand: any) => {
  let index = 0
  for (const group of Object.values(groupedCommands.value)) {
    for (const command of group) {
      if (command.id === targetCommand.id) {
        return index
      }
      index++
    }
  }
  return 0
}

// Get all commands in order for keyboard navigation
const allCommands = computed(() => {
  const commands: any[] = []
  Object.values(groupedCommands.value).forEach(group => {
    commands.push(...group)
  })
  return commands
})

// Keyboard navigation
const highlightNext = () => {
  highlightedIndex.value = Math.min(highlightedIndex.value + 1, allCommands.value.length - 1)
}

const highlightPrevious = () => {
  highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
}

const executeHighlighted = () => {
  const command = allCommands.value[highlightedIndex.value]
  if (command) {
    executeCommand(command)
  }
}

const executeCommand = (command: any) => {
  command.action()
  ui.closeCommandPalette()
}
</script>
