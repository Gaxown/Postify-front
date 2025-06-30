<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-60 overflow-hidden flex items-center justify-center"
    @click="handleBackdropClick"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black transition-opacity duration-300"
      :class="{ 'bg-opacity-60': isOpen, 'bg-opacity-0': !isOpen }"
    ></div>
    
    <!-- Modal Panel -->
    <div
      ref="modalPanel"
      class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl
             transition-all duration-300 ease-out w-full max-w-md mx-4
             transform"
      :class="{
        'scale-100 opacity-100': isOpen,
        'scale-95 opacity-0': !isOpen
      }"
    >
      <!-- Header -->
      <div class="p-6 text-center">
        <!-- Warning Icon with Animation -->
        <div class="mx-auto flex items-center justify-center w-16 h-16 
                    bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
          <Icon 
            name="heroicons:exclamation-triangle" 
            class="h-8 w-8 text-red-600 dark:text-red-400"
            :class="{ 'animate-bounce': showWarningAnimation }"
          />
        </div>
        
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Delete Task
        </h2>
        
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete "<strong>{{ task?.title }}</strong>"?
          This action cannot be undone.
        </p>
        
        <!-- Task Preview -->
        <div 
          v-if="task"
          class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-6 text-left"
        >
          <div class="flex items-center space-x-2 mb-2">
            <div 
              class="w-1 h-4 rounded-full"
              :style="{ background: priorityGradient }"
            ></div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ task.title }}
            </span>
          </div>
          
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div class="flex items-center space-x-2">
              <span class="capitalize">{{ task.status?.replace('-', ' ') }}</span>
              <span>•</span>
              <span class="capitalize">{{ task.priority }}</span>
            </div>
            <div v-if="task.assignee" class="flex items-center space-x-1">
              <Icon name="heroicons:user" class="h-3 w-3" />
              <span>{{ task.assignee.split(' ')[0] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end space-x-3 px-6 pb-6">
        <!-- Cancel Button -->
        <button
          @click="close"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                 hover:text-gray-900 dark:hover:text-white
                 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        
        <!-- Delete Button with Progress Ring -->
        <div class="relative">
          <button
            ref="deleteButton"
            @mousedown="startHoldProgress"
            @mouseup="stopHoldProgress"
            @mouseleave="stopHoldProgress"
            @touchstart="startHoldProgress"
            @touchend="stopHoldProgress"
            @touchcancel="stopHoldProgress"
            class="relative px-6 py-2 text-sm font-medium text-white 
                   bg-red-600 hover:bg-red-700 rounded-lg
                   transition-all duration-200 overflow-hidden
                   focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            :class="{
              'bg-red-700 scale-95': isHolding,
              'bg-green-600': isCompleted
            }"
            :disabled="isCompleted"
          >
            <!-- Background Progress -->
            <div
              class="absolute inset-0 bg-red-800 transition-all duration-75 ease-linear"
              :style="{ 
                width: `${holdProgress}%`,
                opacity: isHolding ? 0.7 : 0
              }"
            ></div>
            
            <!-- Text -->
            <span class="relative z-10">
              {{ isCompleted ? 'Deleted!' : isHolding ? `Hold (${Math.ceil((2000 - holdDuration) / 1000)}s)` : 'Hold to Delete' }}
            </span>
            
            <!-- Progress Ring -->
            <div
              v-if="isHolding"
              class="absolute -inset-1 border-2 border-red-300 rounded-lg"
              :style="{
                borderColor: `conic-gradient(from 0deg, #ef4444 ${holdProgress * 3.6}deg, #fecaca ${holdProgress * 3.6}deg)`
              }"
            ></div>
          </button>
          
          <!-- Countdown Animation -->
          <div
            v-if="isHolding"
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                   w-8 h-8 border-2 border-white border-t-transparent rounded-full
                   animate-spin pointer-events-none"
          ></div>
        </div>
      </div>

      <!-- Undo Toast (shown after deletion) -->
      <div
        v-if="showUndoToast"
        class="absolute -bottom-16 left-1/2 transform -translate-x-1/2
               bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900
               px-4 py-2 rounded-lg shadow-lg flex items-center space-x-3
               transition-all duration-300"
      >
        <span class="text-sm">Task deleted</span>
        <button
          @click="handleUndo"
          class="px-2 py-1 text-xs bg-blue-600 dark:bg-blue-500 text-white rounded
                 hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          Undo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useKanbanStore } from '~/stores/kanban'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'confirmed'])

const kanbanStore = useKanbanStore()
const modalPanel = ref(null)
const deleteButton = ref(null)

// Hold-to-confirm state
const isHolding = ref(false)
const holdProgress = ref(0)
const holdDuration = ref(0)
const holdInterval = ref(null)
const isCompleted = ref(false)
const showWarningAnimation = ref(false)
const showUndoToast = ref(false)

const HOLD_DURATION = 2000 // 2 seconds

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const priorityGradient = computed(() => {
  if (!props.task) return 'linear-gradient(180deg, #6b7280 0%, #4b5563 100%)'
  
  const gradientMap = {
    low: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
    medium: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
    high: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
    urgent: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)'
  }
  
  return gradientMap[props.task.priority] || gradientMap.medium
})

// Methods
const close = () => {
  if (!isHolding.value && !isCompleted.value) {
    isOpen.value = false
    resetState()
  }
}

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

const resetState = () => {
  isHolding.value = false
  holdProgress.value = 0
  holdDuration.value = 0
  isCompleted.value = false
  showWarningAnimation.value = false
  showUndoToast.value = false
  
  if (holdInterval.value) {
    clearInterval(holdInterval.value)
    holdInterval.value = null
  }
}

const startHoldProgress = () => {
  if (isCompleted.value) return
  
  isHolding.value = true
  holdDuration.value = 0
  holdProgress.value = 0
  
  // Trigger haptic feedback
  kanbanStore.triggerHapticFeedback('medium')
  
  holdInterval.value = setInterval(() => {
    holdDuration.value += 50
    holdProgress.value = (holdDuration.value / HOLD_DURATION) * 100
    
    // Haptic pulses during hold
    if (holdDuration.value % 500 === 0) {
      kanbanStore.triggerHapticFeedback('light')
    }
    
    if (holdDuration.value >= HOLD_DURATION) {
      completeHold()
    }
  }, 50)
}

const stopHoldProgress = () => {
  isHolding.value = false
  
  if (holdInterval.value) {
    clearInterval(holdInterval.value)
    holdInterval.value = null
  }
  
  // Reset if not completed
  if (!isCompleted.value) {
    setTimeout(() => {
      if (!isHolding.value) {
        holdProgress.value = 0
        holdDuration.value = 0
      }
    }, 200)
  }
}

const completeHold = () => {
  isHolding.value = false
  isCompleted.value = true
  
  // Strong haptic feedback for completion
  kanbanStore.triggerHapticFeedback('heavy')
  
  // Create particles effect
  createDeleteParticles()
  
  // Close modal and emit confirmation after brief delay
  setTimeout(() => {
    emit('confirmed')
    
    // Show undo toast
    showUndoToast.value = true
    
    // Auto-hide undo toast after 5 seconds
    setTimeout(() => {
      showUndoToast.value = false
      close()
    }, 5000)
  }, 500)
}

const handleUndo = () => {
  // This would typically restore the task
  showUndoToast.value = false
  close()
  
  // You might want to emit an undo event here
  // emit('undo')
}

const createDeleteParticles = () => {
  if (typeof document === 'undefined' || !deleteButton.value) return
  
  const rect = deleteButton.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const particleCount = 12
  const colors = ['#ef4444', '#dc2626', '#b91c1c', '#991b1b']
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: ${centerX}px;
      top: ${centerY}px;
      transform: translate(-50%, -50%);
    `
    
    document.body.appendChild(particle)
    
    const angle = (i / particleCount) * 2 * Math.PI
    const velocity = 80 + Math.random() * 40
    const lifetime = 800 + Math.random() * 400
    
    particle.animate([
      {
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1
      },
      {
        transform: `translate(${Math.cos(angle) * velocity - 50}%, ${Math.sin(angle) * velocity - 50}%) scale(0)`,
        opacity: 0
      }
    ], {
      duration: lifetime,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => {
      particle.remove()
    }
  }
}

// Watch for modal open
watch(isOpen, async (newValue) => {
  if (newValue) {
    resetState()
    await nextTick()
    
    // Animate warning icon
    setTimeout(() => {
      showWarningAnimation.value = true
      setTimeout(() => {
        showWarningAnimation.value = false
      }, 1000)
    }, 300)
  }
})

// Keyboard shortcuts
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    close()
  }
}

// Prevent scroll during hold
const preventScroll = (event) => {
  if (isHolding.value) {
    event.preventDefault()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('touchmove', preventScroll, { passive: false })
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('touchmove', preventScroll)
    resetState()
  })
})
</script>

<style scoped>
/* Modal animations */
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from {
  transform: scale(0.9);
  opacity: 0;
}

.modal-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

/* Hold button animations */
.hold-button {
  transition: all 0.2s ease;
}

.hold-button:active {
  transform: scale(0.95);
}

/* Progress ring animation */
@property --progress {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.progress-ring {
  --progress: 0%;
  background: conic-gradient(from 0deg, #ef4444 var(--progress), transparent var(--progress));
  border-radius: 50%;
  animation: progressSpin 2s linear;
}

@keyframes progressSpin {
  from {
    --progress: 0%;
  }
  to {
    --progress: 100%;
  }
}

/* Warning bounce animation */
@keyframes warningBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-bounce {
  animation: warningBounce 0.6s ease-in-out infinite;
}

/* Undo toast animation */
.undo-toast-enter-active, .undo-toast-leave-active {
  transition: all 0.3s ease;
}

.undo-toast-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.undo-toast-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Completion success animation */
.completion-success {
  animation: completionPulse 0.5s ease-out;
}

@keyframes completionPulse {
  0% {
    transform: scale(1);
    background-color: #dc2626;
  }
  50% {
    transform: scale(1.05);
    background-color: #16a34a;
  }
  100% {
    transform: scale(1);
    background-color: #16a34a;
  }
}

/* Prevent text selection during hold */
.hold-button {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
