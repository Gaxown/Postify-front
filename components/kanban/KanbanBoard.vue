<template>
  <div class="kanban-board h-full flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Task Board
        </h1>
        <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{{ kanbanStore.tasks.length }} tasks</span>
          <span>•</span>
          <span>{{ kanbanStore.completionRate }}% complete</span>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="kanbanStore.searchQuery"
            type="text"
            placeholder="Search tasks..."
            class="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <!-- Filters -->
        <button
          @click="showFilters = !showFilters"
          class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 
                 focus:ring-2 focus:ring-blue-500"
        >
          <Icon name="heroicons:funnel" class="h-4 w-4" />
        </button>
        
        <!-- New Task -->
        <button
          @click="openCreateModal"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                 hover:bg-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500
                 flex items-center space-x-2"
        >
          <Icon name="heroicons:plus" class="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-4 text-sm">
        <!-- Priority Filter -->
        <select 
          v-model="selectedPriority"
          @change="updateFilters"
          class="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        <!-- Platform Filter -->
        <select 
          v-model="selectedPlatform"
          @change="updateFilters"
          class="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Platforms</option>
          <option value="twitter">Twitter</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
          <option value="tiktok">TikTok</option>
        </select>
        
        <!-- Clear Filters -->
        <button
          @click="clearFilters"
          class="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 
                 hover:text-gray-900 dark:hover:text-white"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Board Content -->
    <div 
      ref="boardContainer"
      class="flex-1 flex overflow-x-auto overflow-y-hidden"
      @scroll="handleBoardScroll"
    >
      <div class="flex space-x-6 p-6 min-w-full">
        <KanbanColumn
          v-for="column in kanbanStore.columns"
          :key="column.id"
          :column="column"
          :tasks="getColumnTasks(column.id)"
          @task-click="openEditModal"
          @create-task="openCreateModalInColumn"
        />
      </div>
    </div>

    <!-- Modals -->
    <KanbanCreateModal
      v-model="createModalOpen"
      :initial-status="createModalStatus"
      @created="handleTaskCreated"
    />
    
    <KanbanEditModal
      v-model="editModalOpen"
      :task="editingTask"
      @updated="handleTaskUpdated"
      @deleted="handleTaskDeleted"
    />

    <!-- Undo Toast -->
    <div
      v-if="showUndoToast"
      class="fixed bottom-4 right-4 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 
             px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 z-50"
    >
      <span class="text-sm">{{ undoMessage }}</span>
      <button
        @click="handleUndo"
        class="px-3 py-1 text-xs bg-blue-600 dark:bg-blue-500 text-white rounded
               hover:bg-blue-700 dark:hover:bg-blue-600"
      >
        Undo
      </button>
      <button
        @click="hideUndoToast"
        class="text-gray-400 hover:text-white dark:hover:text-gray-900"
      >
        <Icon name="heroicons:x-mark" class="h-4 w-4" />
      </button>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="kanbanStore.isLoading"
      class="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 
             flex items-center justify-center z-40"
    >
      <div class="flex items-center space-x-3">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="text-gray-900 dark:text-white font-medium">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useKanbanStore } from '~/stores/kanban'

const kanbanStore = useKanbanStore()

// Reactive data
const boardContainer = ref(null)
const showFilters = ref(false)
const createModalOpen = ref(false)
const editModalOpen = ref(false)
const createModalStatus = ref('todo')
const editingTask = ref(null)
const selectedPriority = ref('')
const selectedPlatform = ref('')
const showUndoToast = ref(false)
const undoMessage = ref('')
const undoTimeoutId = ref(null)

// Auto-scroll detection
let autoScrollInterval = null

// Computed
const getColumnTasks = (columnId) => {
  const column = kanbanStore.columns.find(col => col.id === columnId)
  if (!column) return []
  
  return kanbanStore.filteredTasks
    .filter(task => task.status === column.status)
    .sort((a, b) => a.position - b.position)
}

// Methods
const openCreateModal = () => {
  createModalStatus.value = 'todo'
  createModalOpen.value = true
}

const openCreateModalInColumn = (status) => {
  createModalStatus.value = status
  createModalOpen.value = true
}

const openEditModal = (task) => {
  editingTask.value = task
  editModalOpen.value = true
}

const handleTaskCreated = (task) => {
  createModalOpen.value = false
  showUndoNotification(`Created task "${task.title}"`)
}

const handleTaskUpdated = (task) => {
  editModalOpen.value = false
  editingTask.value = null
  showUndoNotification(`Updated task "${task.title}"`)
}

const handleTaskDeleted = (task) => {
  editModalOpen.value = false
  editingTask.value = null
  showUndoNotification(`Deleted task "${task.title}"`)
}

const updateFilters = () => {
  kanbanStore.setFilter('priority', selectedPriority.value || null)
  kanbanStore.setFilter('platform', selectedPlatform.value || null)
}

const clearFilters = () => {
  selectedPriority.value = ''
  selectedPlatform.value = ''
  kanbanStore.clearFilters()
}

const showUndoNotification = (message) => {
  undoMessage.value = message
  showUndoToast.value = true
  
  // Clear existing timeout
  if (undoTimeoutId.value) {
    clearTimeout(undoTimeoutId.value)
  }
  
  // Auto-hide after 5 seconds
  undoTimeoutId.value = setTimeout(() => {
    hideUndoToast()
  }, 5000)
}

const hideUndoToast = () => {
  showUndoToast.value = false
  if (undoTimeoutId.value) {
    clearTimeout(undoTimeoutId.value)
    undoTimeoutId.value = null
  }
}

const handleUndo = async () => {
  await kanbanStore.undo()
  hideUndoToast()
}

const handleBoardScroll = (event) => {
  const container = event.target
  const { scrollLeft, scrollWidth, clientWidth } = container
  
  // Edge auto-scroll detection
  const edgeThreshold = 100
  const leftEdge = scrollLeft <= edgeThreshold
  const rightEdge = scrollLeft >= scrollWidth - clientWidth - edgeThreshold
  
  kanbanStore.setAutoScrollEdge('left', leftEdge)
  kanbanStore.setAutoScrollEdge('right', rightEdge)
}

const startAutoScroll = (direction) => {
  if (autoScrollInterval) return
  
  autoScrollInterval = setInterval(() => {
    if (!boardContainer.value) return
    
    const scrollAmount = direction === 'left' ? -10 : 10
    boardContainer.value.scrollLeft += scrollAmount
  }, 16) // ~60fps
}

const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
    autoScrollInterval = null
  }
}

// Keyboard shortcuts
const handleKeydown = (event) => {
  // Ctrl/Cmd + Z for undo
  if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
    event.preventDefault()
    handleUndo()
  }
  
  // Ctrl/Cmd + N for new task
  if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
    event.preventDefault()
    openCreateModal()
  }
  
  // Escape to close modals
  if (event.key === 'Escape') {
    if (createModalOpen.value) {
      createModalOpen.value = false
    } else if (editModalOpen.value) {
      editModalOpen.value = false
      editingTask.value = null
    } else if (showFilters.value) {
      showFilters.value = false
    }
  }
}

// Lifecycle
onMounted(async () => {
  await kanbanStore.initialize()
  
  // Add keyboard listeners
  window.addEventListener('keydown', handleKeydown)
  
  // Watch for drag state changes for auto-scroll
  watch(() => kanbanStore.dragState.isDragging, (isDragging) => {
    if (!isDragging) {
      stopAutoScroll()
    }
  })
  
  // Watch for auto-scroll edge changes
  watch(() => kanbanStore.autoScrollEdges, (edges) => {
    if (kanbanStore.dragState.isDragging) {
      if (edges.left && !edges.right) {
        startAutoScroll('left')
      } else if (edges.right && !edges.left) {
        startAutoScroll('right')
      } else {
        stopAutoScroll()
      }
    }
  }, { deep: true })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  stopAutoScroll()
  if (undoTimeoutId.value) {
    clearTimeout(undoTimeoutId.value)
  }
})
</script>

<style scoped>
.kanban-board {
  position: relative;
}

/* Custom scrollbar for board container */
.kanban-board ::-webkit-scrollbar {
  height: 8px;
}

.kanban-board ::-webkit-scrollbar-track {
  background-color: rgb(243 244 246);
  border-radius: 0.25rem;
}

.dark .kanban-board ::-webkit-scrollbar-track {
  background-color: rgb(31 41 55);
}

.kanban-board ::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 0.25rem;
}

.dark .kanban-board ::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

.kanban-board ::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

.dark .kanban-board ::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}

/* Smooth transitions */
.kanban-board * {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
</style>
