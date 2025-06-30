<template>
  <div
    v-if="shouldShow"
    class="drop-indicator"
    :class="[
      indicatorClasses,
      { 'invalid': isInvalidDrop }
    ]"
    @drop="handleDrop"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave="handleDragLeave"
  >
    <!-- Blue Spacer Line -->
    <div 
      class="spacer-line bg-blue-500 rounded-full transition-all duration-200"
      :class="{
        'h-1 opacity-100': isActive,
        'h-0.5 opacity-60': !isActive,
        'bg-red-500': isInvalidDrop
      }"
    ></div>
    
    <!-- Drop Zone Text (optional) -->
    <div
      v-if="showDropText"
      class="drop-text absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2
             bg-blue-500 text-white text-xs px-2 py-1 rounded-full
             opacity-0 transition-opacity duration-200"
      :class="{
        'opacity-100': isActive && showDropText,
        'bg-red-500': isInvalidDrop
      }"
    >
      {{ dropText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useKanbanStore } from '~/stores/kanban'

const props = defineProps({
  position: {
    type: Number,
    required: true
  },
  columnId: {
    type: String,
    required: true
  },
  showDropText: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['drop'])

const kanbanStore = useKanbanStore()
const isActive = ref(false)
const isHovered = ref(false)

// Computed
const shouldShow = computed(() => {
  return kanbanStore.dragState.dropIndicator.isVisible &&
         kanbanStore.dragState.dropIndicator.columnId === props.columnId &&
         kanbanStore.dragState.dropIndicator.position === props.position
})

const isInvalidDrop = computed(() => {
  if (!kanbanStore.dragState.draggedTask) return false
  
  // Check if trying to drop in the same position
  const draggedTask = kanbanStore.dragState.draggedTask
  const sourceColumn = kanbanStore.columns.find(col => col.status === draggedTask.status)
  
  return sourceColumn?.id === props.columnId && 
         draggedTask.position === props.position
})

const dropText = computed(() => {
  if (isInvalidDrop.value) return 'Cannot drop here'
  return 'Drop here'
})

const indicatorClasses = computed(() => {
  const classes = [
    'relative w-full h-4 flex items-center justify-center my-1',
    'transition-all duration-200 ease-out'
  ]
  
  if (isActive.value) {
    classes.push('scale-105')
  }
  
  if (isHovered.value) {
    classes.push('bg-blue-50 dark:bg-blue-900/20 rounded')
  }
  
  return classes
})

// Methods
const handleDrop = (event) => {
  event.preventDefault()
  
  if (isInvalidDrop.value) {
    // Trigger invalid drop animation
    triggerInvalidFeedback()
    return
  }
  
  // Trigger success feedback
  triggerSuccessFeedback()
  
  emit('drop', props.position)
}

const handleDragOver = (event) => {
  event.preventDefault()
  isActive.value = true
}

const handleDragEnter = (event) => {
  event.preventDefault()
  isHovered.value = true
  isActive.value = true
}

const handleDragLeave = (event) => {
  // Only hide if we're actually leaving this element
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isHovered.value = false
    isActive.value = false
  }
}

const triggerSuccessFeedback = () => {
  // Create success particles
  createDropParticles('success')
  
  // Haptic feedback
  kanbanStore.triggerHapticFeedback('light')
}

const triggerInvalidFeedback = () => {
  // Create error particles
  createDropParticles('error')
  
  // Haptic feedback
  kanbanStore.triggerHapticFeedback('heavy')
}

const createDropParticles = (type = 'success') => {
  if (typeof document === 'undefined') return
  
  const colors = type === 'success' 
    ? ['#3b82f6', '#1d4ed8', '#60a5fa'] 
    : ['#ef4444', '#dc2626', '#f87171']
  
  const particleCount = 8
  const container = document.querySelector('.kanban-board')
  
  if (!container) return
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'drop-particle'
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    `
    
    container.appendChild(particle)
    
    // Animate particle
    const angle = (i / particleCount) * 2 * Math.PI
    const velocity = 50 + Math.random() * 30
    const lifetime = 500 + Math.random() * 300
    
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

// Watch for magnetic snapping
const setupMagneticSnapping = () => {
  if (typeof document === 'undefined') return
  
  let rafId = null
  
  const updateMagneticEffect = () => {
    if (!shouldShow.value || !kanbanStore.dragState.isDragging) {
      rafId = null
      return
    }
    
    // Get mouse position from the dragged task
    const draggedElement = document.querySelector('.kanban-task[data-dragging="true"]')
    if (draggedElement) {
      const rect = draggedElement.getBoundingClientRect()
      const mouseY = rect.top + rect.height / 2
      
      // Calculate magnetic threshold (20px)
      const dropIndicator = document.querySelector(`.drop-indicator[data-position="${props.position}"]`)
      if (dropIndicator) {
        const indicatorRect = dropIndicator.getBoundingClientRect()
        const distance = Math.abs(mouseY - (indicatorRect.top + indicatorRect.height / 2))
        
        if (distance <= 20) {
          // Apply magnetic effect
          isActive.value = true
          
          // Visual feedback for magnetic snapping
          dropIndicator.style.transform = 'scaleY(1.5)'
          dropIndicator.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
        } else {
          dropIndicator.style.transform = ''
          dropIndicator.style.backgroundColor = ''
        }
      }
    }
    
    rafId = requestAnimationFrame(updateMagneticEffect)
  }
  
  if (shouldShow.value && kanbanStore.dragState.isDragging) {
    rafId = requestAnimationFrame(updateMagneticEffect)
  }
  
  return () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  }
}

// Lifecycle
onMounted(() => {
  const cleanup = setupMagneticSnapping()
  
  onUnmounted(() => {
    cleanup?.()
  })
})
</script>

<style scoped>
.drop-indicator {
  position: relative;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.drop-indicator.invalid {
  animation: invalidShake 0.3s ease-in-out;
}

@keyframes invalidShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.spacer-line {
  width: 100%;
  position: relative;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
}

.drop-indicator:hover .spacer-line {
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
}

.drop-indicator.invalid .spacer-line {
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
}

.drop-text {
  white-space: nowrap;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Magnetic snapping effect */
.drop-indicator[data-magnetic="true"] {
  animation: magneticPulse 1s infinite;
}

@keyframes magneticPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* Success drop animation */
.drop-indicator.success {
  animation: successDrop 0.4s ease-out;
}

@keyframes successDrop {
  0% {
    transform: scale(1);
    background-color: transparent;
  }
  50% {
    transform: scale(1.2);
    background-color: rgba(34, 197, 94, 0.2);
  }
  100% {
    transform: scale(1);
    background-color: transparent;
  }
}

/* Presence animations */
.drop-indicator {
  animation: dropIndicatorEnter 0.2s ease-out;
}

@keyframes dropIndicatorEnter {
  from {
    opacity: 0;
    height: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    height: 1rem;
    transform: scaleY(1);
  }
}
</style>
