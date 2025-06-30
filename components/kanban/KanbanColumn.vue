<template>
  <div
    ref="columnElement"
    class="kanban-column bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-w-80 max-w-80 h-fit"
    :class="[
      columnClasses,
      {
        'ring-2 ring-blue-500 ring-opacity-50': isDragTarget,
        'border-dashed border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20': 
          dragState.isDragging && isDragTarget,
      }
    ]"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <!-- Column Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div
          class="w-3 h-3 rounded-full"
          :class="columnColorClass"
        ></div>
        <h3 class="font-semibold text-gray-900 dark:text-white">
          {{ column.title }}
        </h3>
        <span 
          class="px-2 py-1 text-xs font-medium rounded-full"
          :class="[
            taskCountBadgeClass,
            { 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': isOverLimit }
          ]"
        >
          {{ tasks.length }}{{ column.limit ? `/${column.limit}` : '' }}
        </span>
      </div>
      
      <button
        @click="$emit('create-task', column.status)"
        class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 
               text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
               transition-colors duration-200"
      >
        <Icon name="heroicons:plus" class="h-4 w-4" />
      </button>
    </div>

    <!-- Tasks Container -->
    <div
      ref="tasksContainer"
      class="space-y-3 min-h-32 max-h-screen overflow-y-auto"
      :class="{
        'scroll-snap-y': tasks.length > 5
      }"
      @scroll="handleScroll"
    >
      <template v-for="(task, index) in tasks" :key="task.id">
        <!-- Drop Indicator Above Task -->
        <KanbanDropIndicator
          v-if="shouldShowDropIndicator(index)"
          :position="index"
          :column-id="column.id"
          @drop="handleDrop"
        />
        
        <!-- Task Card -->
        <KanbanTask
          :task="task"
          :is-dragging="dragState.draggedTask?.id === task.id"
          @click="$emit('task-click', task)"
          @drag-start="handleTaskDragStart(task)"
          @drag-end="handleTaskDragEnd"
        />
      </template>
      
      <!-- Drop Indicator at End -->
      <KanbanDropIndicator
        v-if="shouldShowDropIndicatorAtEnd()"
        :position="tasks.length"
        :column-id="column.id"
        @drop="handleDrop"
      />
      
      <!-- Empty State -->
      <div
        v-if="tasks.length === 0"
        class="flex flex-col items-center justify-center py-8 text-center"
      >
        <div 
          class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 
                 flex items-center justify-center mb-3"
        >
          <Icon name="heroicons:archive-box" class="h-6 w-6 text-gray-400" />
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
          No tasks in {{ column.title.toLowerCase() }}
        </p>
        <button
          @click="$emit('create-task', column.status)"
          class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 
                 dark:hover:text-blue-300 font-medium"
        >
          Add your first task
        </button>
      </div>
      
      <!-- Add Task Button (when tasks exist) -->
      <div v-if="tasks.length > 0" class="pt-2">
        <button
          @click="$emit('create-task', column.status)"
          class="w-full p-3 text-sm text-gray-600 dark:text-gray-400 
                 border border-dashed border-gray-300 dark:border-gray-600 
                 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 
                 hover:text-gray-700 dark:hover:text-gray-300 
                 hover:bg-gray-50 dark:hover:bg-gray-700/50
                 transition-all duration-200 group"
          :class="{
            'animate-pulse border-blue-500 text-blue-600 dark:text-blue-400': 
              dragState.isDragging && isDragTarget
          }"
        >
          <div class="flex items-center justify-center space-x-2">
            <Icon 
              name="heroicons:plus" 
              class="h-4 w-4 group-hover:scale-110 transition-transform" 
            />
            <span>Add task</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useKanbanStore } from '~/stores/kanban'

const props = defineProps({
  column: {
    type: Object,
    required: true
  },
  tasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['task-click', 'create-task'])

const kanbanStore = useKanbanStore()
const columnElement = ref(null)
const tasksContainer = ref(null)

// Computed
const dragState = computed(() => kanbanStore.dragState)

const isDragTarget = computed(() => {
  return dragState.value.isDragging && 
         dragState.value.targetColumn === props.column.id
})

const isOverLimit = computed(() => {
  return props.column.limit && props.tasks.length > props.column.limit
})

const columnColorClass = computed(() => {
  const colorMap = {
    slate: 'bg-slate-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500'
  }
  return colorMap[props.column.color] || 'bg-gray-500'
})

const taskCountBadgeClass = computed(() => {
  if (isOverLimit.value) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
})

const columnClasses = computed(() => {
  const classes = []
  
  // Priority visual feedback based on tasks
  const hasUrgentTasks = props.tasks.some(task => task.priority === 'urgent')
  const hasHighPriorityTasks = props.tasks.some(task => task.priority === 'high')
  
  if (hasUrgentTasks) {
    classes.push('ring-1 ring-red-300 dark:ring-red-700')
  } else if (hasHighPriorityTasks) {
    classes.push('ring-1 ring-orange-300 dark:ring-orange-700')
  }
  
  return classes
})

// Methods
const handlePointerEnter = () => {
  if (dragState.value.isDragging) {
    kanbanStore.setTargetColumn(props.column.id)
  }
}

const handlePointerLeave = () => {
  if (dragState.value.isDragging) {
    kanbanStore.setTargetColumn(null)
  }
}

const handleTaskDragStart = (task) => {
  kanbanStore.startDrag(task)
}

const handleTaskDragEnd = () => {
  kanbanStore.endDrag()
}

const shouldShowDropIndicator = (index) => {
  return dragState.value.dropIndicator.isVisible &&
         dragState.value.dropIndicator.columnId === props.column.id &&
         dragState.value.dropIndicator.position === index
}

const shouldShowDropIndicatorAtEnd = () => {
  return dragState.value.dropIndicator.isVisible &&
         dragState.value.dropIndicator.columnId === props.column.id &&
         dragState.value.dropIndicator.position === props.tasks.length
}

const handleDrop = async (position) => {
  if (!dragState.value.draggedTask) return
  
  const targetStatus = props.column.status
  await kanbanStore.moveTask(
    dragState.value.draggedTask.id,
    targetStatus,
    position
  )
  
  kanbanStore.endDrag()
  
  // Trigger success feedback
  await nextTick()
  if (columnElement.value) {
    columnElement.value.classList.add('animate-pulse')
    setTimeout(() => {
      columnElement.value?.classList.remove('animate-pulse')
    }, 300)
  }
}

const handleScroll = (event) => {
  // Snap scrolling for better UX with many tasks
  if (props.tasks.length > 5) {
    const container = event.target
    const scrollTop = container.scrollTop
    const cardHeight = 120 // Approximate task card height
    const snapPosition = Math.round(scrollTop / cardHeight) * cardHeight
    
    // Debounced smooth snap
    clearTimeout(scrollSnapTimeout)
    scrollSnapTimeout = setTimeout(() => {
      container.scrollTo({
        top: snapPosition,
        behavior: 'smooth'
      })
    }, 150)
  }
}

let scrollSnapTimeout = null

// Watch for urgent tasks and provide visual feedback
watch(() => props.tasks, (newTasks) => {
  const urgentTasks = newTasks.filter(task => {
    if (!task.dueDate) return false
    const now = new Date()
    const dueDate = new Date(task.dueDate)
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilDue <= 48 && hoursUntilDue > 0
  })
  
  // Pulse animation for urgent deadlines
  if (urgentTasks.length > 0 && columnElement.value) {
    columnElement.value.classList.add('animate-pulse')
    setTimeout(() => {
      columnElement.value?.classList.remove('animate-pulse')
    }, 2000)
  }
}, { deep: true })

// Auto-scroll to new tasks
watch(() => props.tasks.length, (newCount, oldCount) => {
  if (newCount > oldCount && tasksContainer.value) {
    nextTick(() => {
      tasksContainer.value.scrollTo({
        top: tasksContainer.value.scrollHeight,
        behavior: 'smooth'
      })
    })
  }
})
</script>

<style scoped>
.kanban-column {
  /* Smooth transitions for drag feedback */
  transition: all 0.2s ease;
}

.kanban-column:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Custom scrollbar */
.kanban-column ::-webkit-scrollbar {
  width: 4px;
}

.kanban-column ::-webkit-scrollbar-track {
  background-color: transparent;
}

.kanban-column ::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

.dark .kanban-column ::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

.kanban-column ::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

.dark .kanban-column ::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}

/* Scroll snap for better task navigation */
.scroll-snap-y {
  scroll-snap-type: y mandatory;
}

.scroll-snap-y > * {
  scroll-snap-align: start;
}

/* Enhanced drag target styles */
.kanban-column.ring-2 {
  animation: dragTargetPulse 1s infinite;
}

@keyframes dragTargetPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.95;
  }
}

/* Priority border animations */
.ring-1.ring-red-300 {
  animation: urgentGlow 2s infinite;
}

@keyframes urgentGlow {
  0%, 100% {
    box-shadow: 0 0 0 1px theme('colors.red.300');
  }
  50% {
    box-shadow: 0 0 0 2px theme('colors.red.400'), 0 0 8px theme('colors.red.200');
  }
}

.ring-1.ring-orange-300 {
  animation: highPriorityGlow 3s infinite;
}

@keyframes highPriorityGlow {
  0%, 100% {
    box-shadow: 0 0 0 1px theme('colors.orange.300');
  }
  50% {
    box-shadow: 0 0 0 1px theme('colors.orange.400');
  }
}
</style>
