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
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
             bg-white dark:bg-gray-800 rounded-xl shadow-2xl
             transition-all duration-300 ease-out w-full max-w-2xl max-h-[90vh] overflow-hidden"
      :class="{
        'scale-100 opacity-100': isOpen,
        'scale-95 opacity-0': !isOpen
      }"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div
            class="w-1 h-8 rounded-full"
            :style="{ background: priorityGradient }"
          ></div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Task
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Created {{ formatDate(task?.createdAt) }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <!-- Duplicate Button -->
          <button
            @click="handleDuplicate"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                   text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Duplicate task"
          >
            <Icon name="heroicons:document-duplicate" class="h-5 w-5" />
          </button>
          
          <!-- Close Button -->
          <button
            @click="close"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                   text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Icon name="heroicons:x-mark" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-96">
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
              rows="4"
              placeholder="Describe the task..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <!-- Priority & Status Row -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Priority -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="priority in priorities"
                  :key="priority.value"
                  type="button"
                  @click="form.priority = priority.value"
                  class="flex items-center justify-center px-2 py-2 rounded-lg border text-xs font-medium
                         transition-all duration-200"
                  :class="[
                    form.priority === priority.value
                      ? priority.selectedClass
                      : priority.defaultClass
                  ]"
                >
                  <div 
                    class="w-2 h-2 rounded-full mr-1"
                    :class="priority.colorClass"
                  ></div>
                  {{ priority.label }}
                </button>
              </div>
            </div>

            <!-- Status -->
            <div>
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
          </div>

          <!-- Platform & Assignee Row -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Platform -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="platform in platforms"
                  :key="platform.value"
                  type="button"
                  @click="form.platform = form.platform === platform.value ? null : platform.value"
                  class="flex flex-col items-center justify-center p-2 rounded-lg border
                         transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  :class="[
                    form.platform === platform.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                >
                  <PlatformIcon :platform="platform.value" size="xs" />
                  <span class="text-xs mt-1 capitalize">{{ platform.label.slice(0, 3) }}</span>
                </button>
              </div>
            </div>

            <!-- Assignee -->
            <div>
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
          </div>

          <!-- Due Date & Hours Row -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Due Date -->
            <div>
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

            <!-- Hours -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hours (Est. / Actual)
              </label>
              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model.number="form.estimatedHours"
                  type="number"
                  min="0.5"
                  max="40"
                  step="0.5"
                  placeholder="Est."
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 
                         rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <input
                  v-model.number="form.actualHours"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  placeholder="Actual"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 
                         rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>
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

          <!-- Progress Bar (if in progress) -->
          <div v-if="form.status === 'in-progress' && form.estimatedHours && form.actualHours" class="mb-4">
            <div class="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span>Progress</span>
              <span>{{ Math.round((form.actualHours / form.estimatedHours) * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${Math.min((form.actualHours / form.estimatedHours) * 100, 100)}%` }"
              ></div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <!-- Delete Button -->
          <button
            type="button"
            @click="showDeleteConfirmation = true"
            class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 
                   hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20
                   rounded-lg transition-colors duration-200"
          >
            Delete Task
          </button>
        </div>
        
        <div class="flex items-center space-x-3">
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
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <KanbanDeleteModal
      v-model="showDeleteConfirmation"
      :task="task"
      @confirmed="handleDelete"
    />
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
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'updated', 'deleted'])

const kanbanStore = useKanbanStore()
const modalPanel = ref(null)
const titleInput = ref(null)
const newTag = ref('')
const showDeleteConfirmation = ref(false)

// Form data
const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  platform: null,
  dueDate: '',
  assignee: '',
  estimatedHours: null,
  actualHours: null,
  tags: []
})

// Static data (same as CreateModal)
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
  isOpen.value = false
}

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

const populateForm = () => {
  if (!props.task) return
  
  form.title = props.task.title
  form.description = props.task.description || ''
  form.priority = props.task.priority
  form.status = props.task.status
  form.platform = props.task.platform || null
  form.dueDate = props.task.dueDate ? 
    new Date(props.task.dueDate).toISOString().slice(0, 16) : ''
  form.assignee = props.task.assignee || ''
  form.estimatedHours = props.task.estimatedHours || null
  form.actualHours = props.task.actualHours || null
  form.tags = [...(props.task.tags || [])]
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
  if (!form.title.trim() || !props.task) return

  try {
    const updates = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      status: form.status,
      platform: form.platform || undefined,
      dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
      assignee: form.assignee || undefined,
      estimatedHours: form.estimatedHours || undefined,
      actualHours: form.actualHours || undefined,
      tags: form.tags
    }

    await kanbanStore.updateTask(props.task.id, updates)
    
    const updatedTask = { ...props.task, ...updates }
    emit('updated', updatedTask)
    close()
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

const handleDuplicate = async () => {
  if (!props.task) return
  
  try {
    await kanbanStore.duplicateTask(props.task.id)
    close()
  } catch (error) {
    console.error('Failed to duplicate task:', error)
  }
}

const handleDelete = async () => {
  if (!props.task) return
  
  try {
    await kanbanStore.deleteTask(props.task.id)
    emit('deleted', props.task)
    close()
  } catch (error) {
    console.error('Failed to delete task:', error)
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Watch for modal open and task changes
watch([isOpen, () => props.task], async ([newIsOpen, newTask]) => {
  if (newIsOpen && newTask) {
    populateForm()
    await nextTick()
    titleInput.value?.focus()
  }
})

// Keyboard shortcuts
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    if (showDeleteConfirmation.value) {
      showDeleteConfirmation.value = false
    } else {
      close()
    }
  } else if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    handleSubmit()
  } else if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
    event.preventDefault()
    handleDuplicate()
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
/* Modal morphing animation */
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from {
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0;
}

.modal-leave-to {
  transform: translate(-50%, -50%) scale(0.95);
  opacity: 0;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Form animations */
input:focus, textarea:focus, select:focus {
  transform: scale(1.01);
}

/* Button hover effects */
button:hover {
  transform: translateY(-1px);
}

/* Priority gradient animation */
.priority-gradient {
  animation: priorityShimmer 3s infinite;
}

@keyframes priorityShimmer {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}
</style>
