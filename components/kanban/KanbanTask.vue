<template>
  <div
    ref="taskElement"
    class="kanban-task group bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm 
           border border-gray-200 dark:border-gray-700 cursor-pointer
           hover:shadow-md transition-all duration-200"
    :class="[
      taskClasses,
      {
        'scale-105 shadow-xl z-50': isDragging,
        'ring-2 ring-blue-500 ring-opacity-50': isSelected,
        'animate-pulse': isBeingDragged
      }
    ]"
    @click="handleClick"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerCancel"
  >
    <!-- Priority Color Bar -->
    <div
      class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
      :class="priorityColorClass"
      :style="{
        background: task.color || priorityGradient,
        opacity: urgencyIntensity
      }"
    ></div>

    <!-- Task Content -->
    <div class="relative pl-3">
      <!-- Header Row -->
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {{ task.title }}
          </h4>
          <div class="flex items-center space-x-2 mt-1">
            <!-- Platform Icon -->
            <PlatformIcon
              v-if="task.platform"
              :platform="task.platform"
              size="xs"
            />
            
            <!-- Priority Badge -->
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              :class="priorityBadgeClass"
            >
              {{ task.priority }}
            </span>
          </div>
        </div>
        
        <!-- Drag Handle -->
        <div
          class="drag-handle opacity-0 group-hover:opacity-100 p-1 rounded 
                 hover:bg-gray-100 dark:hover:bg-gray-700 transition-opacity duration-200"
          @pointerdown.stop="startDrag"
        >
          <Icon name="heroicons:bars-3" class="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <!-- Description -->
      <p
        v-if="task.description"
        class="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
      >
        {{ task.description }}
      </p>

      <!-- Tags -->
      <div v-if="task.tags && task.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="tag in task.tags.slice(0, 3)"
          :key="tag"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          {{ tag }}
        </span>
        <span
          v-if="task.tags.length > 3"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          +{{ task.tags.length - 3 }}
        </span>
      </div>

      <!-- Footer Row -->
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div class="flex items-center space-x-2">
          <!-- Assignee Avatar -->
          <div
            v-if="task.assignee"
            class="flex items-center space-x-1"
          >
            <div class="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 
                        flex items-center justify-center text-white text-xs font-medium">
              {{ getInitials(task.assignee) }}
            </div>
            <span class="hidden sm:inline">{{ task.assignee.split(' ')[0] }}</span>
          </div>
          
          <!-- Time Estimate -->
          <div
            v-if="task.estimatedHours"
            class="flex items-center space-x-1"
          >
            <Icon name="heroicons:clock" class="h-3 w-3" />
            <span>{{ task.estimatedHours }}h</span>
          </div>
        </div>

        <!-- Due Date -->
        <div
          v-if="task.dueDate"
          class="flex items-center space-x-1"
          :class="dueDateClass"
        >
          <Icon 
            name="heroicons:calendar-days" 
            class="h-3 w-3"
            :class="{ 'animate-pulse': isOverdue || isDueSoon }"
          />
          <span>{{ formatDueDate(task.dueDate) }}</span>
        </div>
      </div>

      <!-- Progress Bar (if in progress) -->
      <div
        v-if="task.status === 'in-progress' && task.estimatedHours && task.actualHours"
        class="mt-3"
      >
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{{ Math.round((task.actualHours / task.estimatedHours) * 100) }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            class="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min((task.actualHours / task.estimatedHours) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Hover Actions -->
    <div
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
             flex items-center space-x-1 transition-opacity duration-200"
    >
      <button
        @click.stop="$emit('duplicate')"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Duplicate task"
      >
        <Icon name="heroicons:document-duplicate" class="h-3 w-3 text-gray-400" />
      </button>
      <button
        @click.stop="$emit('delete')"
        class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50"
        title="Delete task"
      >
        <Icon name="heroicons:trash" class="h-3 w-3 text-red-400" />
      </button>
    </div>

    <!-- Drag Ghost/Preview -->
    <div
      v-if="isDragging"
      class="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg 
             border-2 border-blue-500 border-dashed animate-pulse"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useKanbanStore } from '~/stores/kanban'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  isDragging: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'drag-start', 'drag-end', 'duplicate', 'delete'])

const kanbanStore = useKanbanStore()
const taskElement = ref(null)

// Drag state
const isBeingDragged = ref(false)
const dragStartPos = ref({ x: 0, y: 0 })
const isDragReady = ref(false)
const longPressTimer = ref(null)

// Computed
const priorityColorClass = computed(() => {
  const colorMap = {
    low: 'bg-green-500',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500'
  }
  return colorMap[props.task.priority] || 'bg-gray-500'
})

const priorityBadgeClass = computed(() => {
  const classMap = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classMap[props.task.priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
})

const priorityGradient = computed(() => {
  const gradientMap = {
    low: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
    medium: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
    high: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
    urgent: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)'
  }
  return gradientMap[props.task.priority] || 'linear-gradient(180deg, #6b7280 0%, #4b5563 100%)'
})

const isOverdue = computed(() => {
  if (!props.task.dueDate) return false
  return new Date() > new Date(props.task.dueDate)
})

const isDueSoon = computed(() => {
  if (!props.task.dueDate) return false
  const now = new Date()
  const dueDate = new Date(props.task.dueDate)
  const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  return hoursUntilDue <= 48 && hoursUntilDue > 0
})

const urgencyIntensity = computed(() => {
  if (isOverdue.value) return 1.0
  if (isDueSoon.value) {
    const now = new Date()
    const dueDate = new Date(props.task.dueDate)
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return Math.max(0.5, 1 - (hoursUntilDue / 48))
  }
  return 0.7
})

const dueDateClass = computed(() => {
  if (isOverdue.value) {
    return 'text-red-600 dark:text-red-400 font-medium'
  }
  if (isDueSoon.value) {
    return 'text-orange-600 dark:text-orange-400 font-medium'
  }
  return 'text-gray-500 dark:text-gray-400'
})

const taskClasses = computed(() => {
  const classes = []
  
  // Priority-based styling
  if (props.task.priority === 'urgent') {
    classes.push('ring-1 ring-red-200 dark:ring-red-800')
  } else if (props.task.priority === 'high') {
    classes.push('ring-1 ring-orange-200 dark:ring-orange-800')
  }
  
  // Due date styling
  if (isOverdue.value) {
    classes.push('bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800')
  } else if (isDueSoon.value) {
    classes.push('bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800')
  }
  
  return classes
})

// Methods
const handleClick = (event) => {
  if (!isDragReady.value) {
    emit('click', props.task)
  }
}

const handlePointerDown = (event) => {
  dragStartPos.value = { x: event.clientX, y: event.clientY }
  isDragReady.value = false
  
  // Start long press timer for mobile
  if (event.pointerType === 'touch') {
    longPressTimer.value = setTimeout(() => {
      startDrag()
    }, 500) // 500ms long press
  }
}

const handlePointerMove = (event) => {
  if (longPressTimer.value) {
    const distance = Math.sqrt(
      Math.pow(event.clientX - dragStartPos.value.x, 2) +
      Math.pow(event.clientY - dragStartPos.value.y, 2)
    )
    
    // Cancel long press if moved too far
    if (distance > 10) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }
  }
  
  // Desktop drag detection
  if (event.pointerType === 'mouse' && event.buttons === 1) {
    const distance = Math.sqrt(
      Math.pow(event.clientX - dragStartPos.value.x, 2) +
      Math.pow(event.clientY - dragStartPos.value.y, 2)
    )
    
    if (distance > 5 && !isDragReady.value) {
      startDrag()
    }
  }
}

const handlePointerUp = () => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
  
  if (isBeingDragged.value) {
    endDrag()
  }
}

const handlePointerCancel = () => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
  
  if (isBeingDragged.value) {
    endDrag()
  }
}

const startDrag = () => {
  isDragReady.value = true
  isBeingDragged.value = true
  
  // Add drag classes for visual feedback
  if (taskElement.value) {
    taskElement.value.style.transform = 'scale(1.02)'
    taskElement.value.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.3)'
    taskElement.value.style.zIndex = '50'
  }
  
  // Trigger haptic feedback
  kanbanStore.triggerHapticFeedback('medium')
  
  emit('drag-start', props.task)
  
  // Setup global mouse/touch move handlers
  document.addEventListener('pointermove', handleGlobalPointerMove)
  document.addEventListener('pointerup', handleGlobalPointerUp)
}

const endDrag = () => {
  isDragReady.value = false
  isBeingDragged.value = false
  
  // Reset visual state
  if (taskElement.value) {
    taskElement.value.style.transform = ''
    taskElement.value.style.boxShadow = ''
    taskElement.value.style.zIndex = ''
  }
  
  emit('drag-end')
  
  // Cleanup global handlers
  document.removeEventListener('pointermove', handleGlobalPointerMove)
  document.removeEventListener('pointerup', handleGlobalPointerUp)
}

const handleGlobalPointerMove = (event) => {
  if (!isBeingDragged.value) return
  
  // Update cursor position for visual feedback
  if (taskElement.value) {
    const rect = taskElement.value.getBoundingClientRect()
    const x = event.clientX - rect.width / 2
    const y = event.clientY - rect.height / 2
    taskElement.value.style.position = 'fixed'
    taskElement.value.style.left = `${x}px`
    taskElement.value.style.top = `${y}px`
    taskElement.value.style.pointerEvents = 'none'
  }
  
  // Check for drop targets
  const elementBelow = document.elementFromPoint(event.clientX, event.clientY)
  const dropTarget = elementBelow?.closest('.kanban-column')
  
  if (dropTarget) {
    const columnId = dropTarget.dataset.columnId
    if (columnId) {
      kanbanStore.setTargetColumn(columnId)
      
      // Calculate drop position
      const tasks = dropTarget.querySelectorAll('.kanban-task:not([data-dragging="true"])')
      let position = tasks.length
      
      for (let i = 0; i < tasks.length; i++) {
        const taskRect = tasks[i].getBoundingClientRect()
        if (event.clientY < taskRect.top + taskRect.height / 2) {
          position = i
          break
        }
      }
      
      kanbanStore.showDropIndicator(columnId, position)
    }
  } else {
    kanbanStore.setTargetColumn(null)
    kanbanStore.hideDropIndicator()
  }
}

const handleGlobalPointerUp = () => {
  if (isBeingDragged.value) {
    endDrag()
  }
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Tomorrow'
  if (diffInDays === -1) return 'Yesterday'
  if (diffInDays < 0) return `${Math.abs(diffInDays)}d ago`
  if (diffInDays <= 7) return `${diffInDays}d`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Lifecycle
onUnmounted(() => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
  }
  
  // Cleanup global listeners
  document.removeEventListener('pointermove', handleGlobalPointerMove)
  document.removeEventListener('pointerup', handleGlobalPointerUp)
})
</script>

<style scoped>
.kanban-task {
  position: relative;
  user-select: none;
  touch-action: none;
}

.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Priority intensity animation */
.kanban-task[data-priority="urgent"] {
  animation: urgentPulse 2s infinite;
}

@keyframes urgentPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
}

/* Drag feedback animations */
.kanban-task.scale-105 {
  animation: dragLift 0.2s ease-out;
}

@keyframes dragLift {
  from {
    transform: scale(1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  to {
    transform: scale(1.05);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  }
}

/* Success feedback */
.kanban-task.drop-success {
  animation: dropSuccess 0.5s ease-out;
}

@keyframes dropSuccess {
  0% {
    transform: scale(1.1);
    background-color: rgba(34, 197, 94, 0.1);
  }
  100% {
    transform: scale(1);
    background-color: transparent;
  }
}

/* Invalid drop feedback */
.kanban-task.drop-invalid {
  animation: dropInvalid 0.3s ease-out;
}

@keyframes dropInvalid {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
</style>
