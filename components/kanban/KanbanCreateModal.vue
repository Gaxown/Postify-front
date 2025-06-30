<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-hidden"
    @click="handleBackdropClick"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black transition-opacity duration-300"
      :class="{ 'bg-opacity-50': isOpen, 'bg-opacity-0': !isOpen }"
    ></div>
    
    <!-- Modal Panel -->
    <div
      ref="modalPanel"
      class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 
             rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out"
      :class="{
        'translate-y-0': isOpen,
        'translate-y-full': !isOpen
      }"
    >
      <!-- Handle Bar -->
      <div class="flex justify-center pt-4 pb-2">
        <div class="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>
      
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Create New Task
        </h2>
        <button
          @click="close"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Icon name="heroicons:x-mark" class="h-5 w-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 max-h-96 overflow-y-auto">
        <form @submit.prevent="handleSubmit">
          <!-- Title -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              ref="titleInput"
              v-model="form.title"
              type="text"
              placeholder="Enter task title..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
          </div>

          <!-- Description -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Describe the task..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <!-- Priority -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="priority in priorities"
                :key="priority.value"
                type="button"
                @click="form.priority = priority.value"
                class="flex items-center justify-center px-3 py-2 rounded-lg border text-sm font-medium
                       transition-all duration-200"
                :class="[
                  form.priority === priority.value
                    ? priority.selectedClass
                    : priority.defaultClass
                ]"
              >
                <div 
                  class="w-2 h-2 rounded-full mr-2"
                  :class="priority.colorClass"
                ></div>
                {{ priority.label }}
              </button>
            </div>
          </div>

          <!-- Platform Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platform
            </label>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="platform in platforms"
                :key="platform.value"
                type="button"
                @click="form.platform = form.platform === platform.value ? null : platform.value"
                class="flex flex-col items-center justify-center p-3 rounded-lg border
                       transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                :class="[
                  form.platform === platform.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                ]"
              >
                <PlatformIcon :platform="platform.value" size="sm" />
                <span class="text-xs mt-1 capitalize">{{ platform.label }}</span>
              </button>
            </div>
          </div>

          <!-- Status -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="status in statuses" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <!-- Due Date -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <input
              v-model="form.dueDate"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>

          <!-- Assignee -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assignee
            </label>
            <select
              v-model="form.assignee"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Unassigned</option>
              <option v-for="assignee in assignees" :key="assignee" :value="assignee">
                {{ assignee }}
              </option>
            </select>
          </div>

          <!-- Estimated Hours -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estimated Hours
            </label>
            <input
              v-model.number="form.estimatedHours"
              type="number"
              min="0.5"
              max="40"
              step="0.5"
              placeholder="e.g., 2.5"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>

          <!-- Tags -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="tag in form.tags"
                :key="tag"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs
                       bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(tag)"
                  class="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <Icon name="heroicons:x-mark" class="h-3 w-3" />
                </button>
              </span>
            </div>
            <div class="flex space-x-2">
              <input
                v-model="newTag"
                type="text"
                placeholder="Add a tag..."
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @keydown.enter.prevent="addTag"
              >
              <button
                type="button"
                @click="addTag"
                class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="close"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                 hover:text-gray-900 dark:hover:text-white"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          :disabled="!form.title.trim()"
          class="px-6 py-2 text-sm font-medium text-white bg-blue-600 
                 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                 rounded-lg transition-colors duration-200"
        >
          Create Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useKanbanStore } from '~/stores/kanban'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  initialStatus: {
    type: String,
    default: 'todo'
  }
})

const emit = defineEmits(['update:modelValue', 'created'])

const kanbanStore = useKanbanStore()
const modalPanel = ref(null)
const titleInput = ref(null)
const newTag = ref('')

// Form data
const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  status: props.initialStatus,
  platform: null,
  dueDate: '',
  assignee: '',
  estimatedHours: null,
  tags: []
})

// Static data
const priorities = [
  {
    value: 'low',
    label: 'Low',
    colorClass: 'bg-green-500',
    selectedClass: 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    defaultClass: 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
  },
  {
    value: 'medium',
    label: 'Medium',
    colorClass: 'bg-blue-500',
    selectedClass: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    defaultClass: 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
  },
  {
    value: 'high',
    label: 'High',
    colorClass: 'bg-orange-500',
    selectedClass: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
    defaultClass: 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
  },
  {
    value: 'urgent',
    label: 'Urgent',
    colorClass: 'bg-red-500',
    selectedClass: 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    defaultClass: 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
  }
]

const platforms = [
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' }
]

const statuses = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' }
]

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const assignees = computed(() => kanbanStore.allAssignees)

// Methods
const close = () => {
  isOpen.value = false
  resetForm()
}

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  form.status = props.initialStatus
  form.platform = null
  form.dueDate = ''
  form.assignee = ''
  form.estimatedHours = null
  form.tags = []
  newTag.value = ''
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (tag) => {
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  }
}

const handleSubmit = async () => {
  if (!form.title.trim()) return

  try {
    const taskData = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      status: form.status,
      platform: form.platform || undefined,
      dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
      assignee: form.assignee || undefined,
      estimatedHours: form.estimatedHours || undefined,
      tags: form.tags
    }

    const newTask = await kanbanStore.createTask(taskData)
    
    emit('created', newTask)
    close()
    
    // Trigger confetti effect
    if (taskData.priority === 'urgent') {
      triggerConfetti()
    }
  } catch (error) {
    console.error('Failed to create task:', error)
  }
}

const triggerConfetti = () => {
  // Simple confetti effect
  const colors = ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
  const particleCount = 30
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: 50%;
      top: 20%;
      transform: translate(-50%, -50%);
    `
    
    document.body.appendChild(particle)
    
    const angle = Math.random() * 2 * Math.PI
    const velocity = 150 + Math.random() * 100
    
    particle.animate([
      {
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1
      },
      {
        transform: `translate(${Math.cos(angle) * velocity - 50}%, ${Math.sin(angle) * velocity + 200}%) scale(0)`,
        opacity: 0
      }
    ], {
      duration: 1000 + Math.random() * 500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => {
      particle.remove()
    }
  }
}

// Watch for modal open
watch(isOpen, async (newValue) => {
  if (newValue) {
    form.status = props.initialStatus
    await nextTick()
    titleInput.value?.focus()
  }
})

// Keyboard shortcuts
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    close()
  } else if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    handleSubmit()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
/* Slide up animation */
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease-out;
}

.modal-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.modal-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background-color: rgb(243 244 246);
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background-color: rgb(31 41 55);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}

/* Form animations */
input:focus, textarea:focus, select:focus {
  transform: scale(1.01);
}

/* Priority button hover effects */
button:hover {
  transform: translateY(-1px);
}

/* Platform button special effects */
.platform-button {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.platform-button:hover {
  transform: scale(1.05);
}
</style>
