<template>
  <div class="kanban-board">
    <!-- Header -->
    <div class="board-header">
      <div class="header-left">
        <input 
          type="text" 
          placeholder="Search board" 
          class="search-input"
        />
        <button class="filter-btn">
          Quick filters
          <ChevronDown class="w-4 h-4 ml-1" />
        </button>
      </div>
      <div class="header-right">
        <button class="group-btn">Group: Queries</button>
        <button class="view-btn">
          <Maximize2 class="w-4 h-4" />
        </button>
        <button class="more-btn">
          <MoreHorizontal class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Kanban Columns -->
    <div class="kanban-container">
      <div 
        v-for="column in columns" 
        :key="column.id"
        class="kanban-column"
        :class="{ 'drop-target': dragState.targetColumn === column.id }"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter(column.id)"
        @dragleave="handleDragLeave"
        @drop="handleDrop(column.id)"
      >
        <!-- Column Header -->
        <div class="column-header">
          <div v-if="!column.editingTitle" class="column-title-container" @click="startEditTitle(column.id)">
            <h3 class="column-title">{{ column.title }}</h3>
          </div>
          <div v-else class="column-title-edit">
            <input
              :ref="`titleInput-${column.id}`"
              v-model="column.tempTitle"
              @keyup.enter="saveTitle(column.id)"
              @keyup.escape="cancelEditTitle(column.id)"
              @blur="saveTitle(column.id)"
              type="text"
              class="column-title-input"
            />
          </div>
          <span class="column-count">{{ column.cards.length }}</span>
        </div>

        <!-- Cards Container -->
        <div class="cards-container">
          <!-- Drop Indicator at top -->
          <div 
            v-if="dragState.showIndicator && dragState.targetColumn === column.id && dragState.insertIndex === 0"
            class="drop-indicator"
          ></div>

          <!-- Cards -->
          <div
            v-for="(card, index) in column.cards"
            :key="card.id"
            class="card-wrapper"
          >
            <div
              class="kanban-card"
              :class="{ 
                'dragging': dragState.draggedCard?.id === card.id,
                'card-moving': dragState.isActive && dragState.draggedCard?.id !== card.id
              }"
              draggable="true"
              @dragstart="handleDragStart(card, column.id, index, $event)"
              @dragend="handleDragEnd"
              @click="($event) => { $event.stopPropagation(); openTaskModal(card, column.id) }"
            >
              <!-- Card Content -->
              <div class="card-content">
                <p class="card-title">{{ card.title }}</p>
                <div class="card-footer">
                  <span class="card-id">{{ card.id }}</span>
                  <div class="card-meta">
                    <div class="assignees">
                      <div 
                        v-for="assignee in (card.assignees || (card.assignee ? [card.assignee] : []))" 
                        :key="assignee" 
                        class="assignee"
                      >
                        {{ assignee }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Drop Indicator between cards -->
            <div 
              v-if="dragState.showIndicator && dragState.targetColumn === column.id && dragState.insertIndex === index + 1"
              class="drop-indicator"
            ></div>
          </div>

          <!-- Empty state or Create button -->
          <div v-if="column.cards.length === 0" class="empty-column">
            <p class="empty-text">Drop cards here</p>
          </div>
          
          <div v-if="!column.showCardInput" class="create-btn" @click="showCardInput(column.id)">
            <Plus class="w-4 h-4 mr-2" />
            Create
          </div>
          
          <div v-else class="create-card-input-container">
            <input
              :ref="`cardInput-${column.id}`"
              v-model="column.newCardTitle"
              @keyup.enter="addNewCard(column.id)"
              @keyup.escape="cancelAddCard(column.id)"
              type="text"
              placeholder="Enter card title..."
              class="create-card-input"
            />
          </div>
        </div>
      </div>

      <!-- Add Column Button -->
      <div class="add-column-container">
        <div v-if="!showAddInput" class="add-column-btn" @click="openAddColumnInput">
          <Plus class="w-5 h-5 mr-2" />
          Add Column
        </div>
        
        <div v-else class="add-column-input-container">
          <input
            ref="addColumnInput"
            v-model="newColumnTitle"
            @keyup.enter="addNewColumn"
            @keyup.escape="cancelAddColumn"
            type="text"
            placeholder="Enter column title..."
            class="add-column-input"
          />
        </div>
      </div>
    </div>

    <!-- Task Edit Modal -->
    <div v-if="showTaskModal" class="modal-overlay" @click="closeTaskModal">
      <div class="modal-content task-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Edit Task</h2>
          <button @click="closeTaskModal" class="modal-close">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="saveTask" class="modal-form">
          <div class="form-group">
            <label for="taskTitle" class="form-label">Task Title</label>
            <input
              id="taskTitle"
              v-model="taskForm.title"
              type="text"
              class="form-input"
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="taskDescription" class="form-label">Description</label>
            <textarea
              id="taskDescription"
              v-model="taskForm.description"
              class="form-textarea"
              placeholder="Enter task description..."
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Assignees</label>
            <div class="assignee-checkboxes">
              <label v-for="person in availableAssignees" :key="person.id" class="checkbox-label">
                <input
                  type="checkbox"
                  :value="person.id"
                  v-model="taskForm.assignees"
                  class="checkbox-input"
                />
                <span class="checkbox-text">{{ person.name }}</span>
              </label>
            </div>
          </div>
          
          
          <div class="modal-actions">
            <button type="button" @click="deleteTask" class="btn-danger mr-auto">
              Delete Task
            </button>
            <button type="button" @click="closeTaskModal" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Maximize2, MoreHorizontal, Plus, X } from 'lucide-vue-next'

// Sample data matching Jira structure
const columns = ref([
  {
    id: 'selected',
    title: 'SELECTED FOR DEVELOPMENT',
    editingTitle: false,
    tempTitle: '',
    showCardInput: false,
    newCardTitle: '',
    cards: [
      {
        id: 'EL-18',
        title: 'lskdjfl dsmlfijks dfmlskdg sdmlfjs dgksdg sdmlkg gsmkg',
        description: 'This is a sample task description that explains what needs to be done.',
        assignees: ['EI', 'AB']
      }
    ]
  },
  {
    id: 'progress',
    title: 'IN PROGRESS',
    editingTitle: false,
    tempTitle: '',
    showCardInput: false,
    newCardTitle: '',
    cards: [
      {
        id: 'EL-16',
        title: 'change back ground and button design',
        description: 'Update the UI with new design system and modern color palette',
        assignees: ['EI', 'SM', 'YS']
      }
    ]
  },
  {
    id: 'backlog',
    title: 'BACKLOG',
    editingTitle: false,
    tempTitle: '',
    showCardInput: false,
    newCardTitle: '',
    cards: [
      {
        id: 'EL-17',
        title: 'this is tes t',
        description: 'Testing the new functionality with sample data',
        assignees: ['AB']
      },
      {
        id: 'EL-20',
        title: 'lmdfkg',
        description: '',
        assignees: ['MH', 'NK']
      },
      {
        id: 'EL-19',
        title: 'dlkg',
        description: 'Fix bug in drag and drop functionality',
        assignees: ['EI', 'YS', 'SM']
      }
    ]
  },
  {
    id: 'done',
    title: 'DONE',
    editingTitle: false,
    tempTitle: '',
    showCardInput: false,
    newCardTitle: '',
    cards: [
      {
        id: 'EL-18',
        title: 'lskdjfl dsmlfijks dfmlskdg sdmlfjs dgksdg sdmlkg gsmkg',
        description: 'Completed task with full implementation and testing',
        assignees: ['EI', 'AB', 'MH']
      }
    ]
  }
  ])

// Add column functionality
const showAddInput = ref(false)
const newColumnTitle = ref('')
const addColumnInput = ref(null)

const openAddColumnInput = () => {
  // Close any open title editing first
  columns.value.forEach(col => {
    if (col.editingTitle) {
      saveTitle(col.id)
    }
  })
  
  showAddInput.value = true
}

const addNewColumn = () => {
  if (newColumnTitle.value.trim()) {
    const newColumn = {
      id: `column-${Date.now()}`,
      title: newColumnTitle.value.trim().toUpperCase(),
      editingTitle: false,
      tempTitle: '',
      showCardInput: false,
      newCardTitle: '',
      cards: []
    }
    columns.value.push(newColumn)
  }
  
  // Reset
  newColumnTitle.value = ''
  showAddInput.value = false
}

const cancelAddColumn = () => {
  newColumnTitle.value = ''
  showAddInput.value = false
}

// Column title editing functionality
const startEditTitle = (columnId) => {
  // Close any other open title editing first
  columns.value.forEach(col => {
    if (col.id !== columnId && col.editingTitle) {
      saveTitle(col.id)
    }
  })
  
  const column = columns.value.find(col => col.id === columnId)
  if (column) {
    column.tempTitle = column.title
    column.editingTitle = true
    
    // Focus on input after DOM update
    nextTick(() => {
      const input = document.querySelector(`[ref="titleInput-${columnId}"]`)
      if (input) {
        input.focus()
        input.select()
      }
    })
  }
}

const saveTitle = (columnId) => {
  const column = columns.value.find(col => col.id === columnId)
  if (column) {
    if (column.tempTitle.trim()) {
      column.title = column.tempTitle.trim().toUpperCase()
    }
    column.editingTitle = false
    column.tempTitle = ''
  }
}

const cancelEditTitle = (columnId) => {
  const column = columns.value.find(col => col.id === columnId)
  if (column) {
    column.editingTitle = false
    column.tempTitle = ''
  }
}

// Auto focus when input shows
watch(showAddInput, (newValue) => {
  if (newValue) {
    nextTick(() => {
      addColumnInput.value?.focus()
    })
  }
})

// Card creation functionality
const showCardInput = (columnId) => {
  // Close any open title editing first
  columns.value.forEach(col => {
    if (col.editingTitle) {
      saveTitle(col.id)
    }
  })
  
  // Close any other open card inputs and save if they have content
  columns.value.forEach(col => {
    if (col.id !== columnId && col.showCardInput) {
      addNewCard(col.id)
    }
  })
  
  const column = columns.value.find(col => col.id === columnId)
  if (column) {
    column.showCardInput = true
    
    // Focus on input after DOM update
    nextTick(() => {
      const input = document.querySelector(`[ref="cardInput-${columnId}"]`)
      if (input) input.focus()
    })
  }
}

const addNewCard = (columnId) => {
  const column = columns.value.find(col => col.id === columnId)
  if (column) {
    if (column.newCardTitle.trim()) {
      // Generate card ID
      const cardNumber = Math.floor(Math.random() * 1000) + 1
      const newCard = {
        id: `EL-${cardNumber}`,
        title: column.newCardTitle.trim(),
        description: '',
        assignees: ['EI'] // Default assignee
      }
      
      // Add card to the column
      column.cards.push(newCard)
    }
    
    // Reset input state
    column.newCardTitle = ''
    column.showCardInput = false
  }
}

const cancelAddCard = (columnId) => {
  const column = columns.value.find(col => col.id === columnId)
  if (column) {
    column.newCardTitle = ''
    column.showCardInput = false
  }
}

// Task modal functionality
const showTaskModal = ref(false)
const editingTask = ref(null)
const editingTaskColumn = ref(null)

// Available assignees list
const availableAssignees = [
  { id: 'EI', name: 'EI - Abdellatif' },
  { id: 'AB', name: 'AB - Ahmed' },
  { id: 'MH', name: 'MH - Mohammed' },
  { id: 'YS', name: 'YS - Youssef' },
  { id: 'NK', name: 'NK - Nadia' },
  { id: 'SM', name: 'SM - Sara' },
  { id: 'KZ', name: 'KZ - Khalid' },
  { id: 'LM', name: 'LM - Laila' },
  { id: 'OB', name: 'OB - Omar' },
  { id: 'FT', name: 'FT - Fatima' },
  { id: 'RA', name: 'RA - Rachid' },
  { id: 'HA', name: 'HA - Hanane' },
  { id: 'AM', name: 'AM - Amine' },
  { id: 'ZK', name: 'ZK - Zineb' },
  { id: 'IB', name: 'IB - Ibrahim' }
]

const taskForm = reactive({
  title: '',
  description: '',
  assignees: []
})

const openTaskModal = (task, columnId) => {
  // Prevent drag from interfering
  if (dragState.isActive) return
  
  // Close any open title editing first
  columns.value.forEach(col => {
    if (col.editingTitle) {
      saveTitle(col.id)
    }
  })
  
  editingTask.value = task
  editingTaskColumn.value = columnId
  
  // Fill form with task data
  taskForm.title = task.title
  taskForm.description = task.description || ''
  taskForm.assignees = Array.isArray(task.assignees) ? [...task.assignees] : (task.assignee ? [task.assignee] : [])
  
  showTaskModal.value = true
}

const saveTask = () => {
  if (editingTask.value && taskForm.title.trim()) {
    // Update task
    editingTask.value.title = taskForm.title.trim()
    editingTask.value.description = taskForm.description
    editingTask.value.assignees = [...taskForm.assignees]
    // Remove old assignee field if exists
    if (editingTask.value.assignee) {
      delete editingTask.value.assignee
    }
  }
  
  closeTaskModal()
}

const deleteTask = () => {
  if (editingTask.value && editingTaskColumn.value) {
    const column = columns.value.find(col => col.id === editingTaskColumn.value)
    if (column) {
      const taskIndex = column.cards.findIndex(card => card.id === editingTask.value.id)
      if (taskIndex > -1) {
        column.cards.splice(taskIndex, 1)
      }
    }
  }
  
  closeTaskModal()
}

const closeTaskModal = () => {
  showTaskModal.value = false
  editingTask.value = null
  editingTaskColumn.value = null
  
  // Reset form
  taskForm.title = ''
  taskForm.description = ''
  taskForm.assignees = []
}

// Drag state management
const dragState = reactive({
  isActive: false,
  draggedCard: null,
  sourceColumn: null,
  sourceIndex: null,
  targetColumn: null,
  insertIndex: null,
  showIndicator: false
})

let dragTimeout = null

// Drag event handlers
const handleDragStart = (card, columnId, index, event) => {
  // Add delay to distinguish from click
  dragTimeout = setTimeout(() => {
    dragState.isActive = true
    dragState.draggedCard = card
    dragState.sourceColumn = columnId
    dragState.sourceIndex = index
    
    // Set drag image with opacity
    const dragImage = event.target.cloneNode(true)
    dragImage.style.opacity = '0.9'
    dragImage.style.transform = 'scale(1.02)'
    event.dataTransfer.setDragImage(dragImage, 0, 0)
    
    // Set drag effect
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', card.id)
  }, 300)
}

const handleDragEnd = () => {
  if (dragTimeout) {
    clearTimeout(dragTimeout)
    dragTimeout = null
  }
  
  // Reset drag state
  Object.assign(dragState, {
    isActive: false,
    draggedCard: null,
    sourceColumn: null,
    sourceIndex: null,
    targetColumn: null,
    insertIndex: null,
    showIndicator: false
  })
}

const handleDragEnter = (columnId) => {
  if (!dragState.isActive) return
  
  dragState.targetColumn = columnId
  dragState.showIndicator = true
}

const handleDragLeave = (event) => {
  // Only hide indicator if leaving the column entirely
  if (!event.currentTarget.contains(event.relatedTarget)) {
    dragState.showIndicator = false
    dragState.targetColumn = null
  }
}

const handleDragOver = (event) => {
  if (!dragState.isActive) return
  
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  
  // Calculate insert position
  const column = event.currentTarget
  const cardsContainer = column.querySelector('.cards-container')
  const cards = Array.from(cardsContainer.querySelectorAll('.kanban-card'))
  
  let insertIndex = 0
  
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    const rect = card.getBoundingClientRect()
    const cardCenter = rect.top + rect.height / 2
    
    if (event.clientY > cardCenter) {
      insertIndex = i + 1
    } else {
      break
    }
  }
  
  dragState.insertIndex = insertIndex
}

const handleDrop = (targetColumnId) => {
  if (!dragState.isActive || !dragState.draggedCard) return
  
  const sourceColumn = columns.value.find(col => col.id === dragState.sourceColumn)
  const targetColumn = columns.value.find(col => col.id === targetColumnId)
  
  if (!sourceColumn || !targetColumn) return
  
  // Remove card from source
  const [movedCard] = sourceColumn.cards.splice(dragState.sourceIndex, 1)
  
  // Add card to target at calculated position
  const insertIndex = dragState.insertIndex || 0
  targetColumn.cards.splice(insertIndex, 0, movedCard)
  
  // Reset drag state
  handleDragEnd()
}

// Global click handler to close inputs
const handleGlobalClick = (event) => {
  // Check if click is outside any input or create button or modal
  const isInputClick = event.target.closest('.create-card-input-container') || 
                      event.target.closest('.create-btn') ||
                      event.target.closest('.add-column-input-container') ||
                      event.target.closest('.add-column-btn') ||
                      event.target.closest('.modal-content') ||
                      event.target.closest('.kanban-card') ||
                      event.target.closest('.column-title-container') ||
                      event.target.closest('.column-title-edit')
  
  if (!isInputClick) {
    // Close any open card inputs and save if they have content
    columns.value.forEach(col => {
      if (col.showCardInput) {
        addNewCard(col.id)
      }
      
      // Close column title editing
      if (col.editingTitle) {
        saveTitle(col.id)
      }
    })
    
    // Close add column input and save if it has content
    if (showAddInput.value) {
      addNewColumn()
    }
    
    // Close task modal
    if (showTaskModal.value) {
      closeTaskModal()
    }
  }
}

// Add and remove global click listener
onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped>
.kanban-board {
  @apply min-h-screen bg-gray-50 p-4;
}

.board-header {
  @apply flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm;
}

.header-left {
  @apply flex items-center gap-4;
}

.search-input {
  @apply px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.filter-btn {
  @apply flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors;
}

.header-right {
  @apply flex items-center gap-2;
}

.group-btn, .view-btn, .more-btn {
  @apply p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors;
}

.kanban-container {
  @apply flex gap-4 overflow-x-auto pb-4;
  height: calc(100vh - 120px);
  min-height: 500px;
}

.kanban-column {
  @apply flex-shrink-0 w-80 bg-gray-100 rounded-lg p-3 transition-all duration-200;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.kanban-column.drop-target {
  @apply bg-blue-50 border-l-4 border-blue-400;
}

.column-header {
  @apply flex items-center justify-between mb-4;
}

.column-title-container {
  @apply cursor-pointer;
}

.column-title {
  @apply text-sm font-semibold text-gray-700 uppercase tracking-wide;
}

.column-title-container:hover .column-title {
  @apply text-blue-600;
}

.column-title-edit {
  @apply flex-1;
}

.column-title-input {
  @apply text-sm font-semibold text-gray-700 uppercase tracking-wide bg-white border border-blue-400 rounded px-2 py-1 outline-none;
}

.column-count {
  @apply text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full;
}

.cards-container {
  @apply space-y-2;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.card-wrapper {
  @apply relative;
}

.kanban-card {
  @apply bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer transition-all duration-150;
  will-change: transform;
}

.kanban-card:hover {
  @apply shadow-md transform scale-[1.01];
}

.kanban-card.dragging {
  @apply opacity-90 scale-[1.02] shadow-lg z-50 cursor-grabbing;
}

.kanban-card[draggable="true"]:not(.dragging) {
  cursor: grab;
}

.kanban-card.card-moving {
  @apply transition-transform duration-150;
}

.card-content {
  @apply space-y-3;
}

.card-title {
  @apply text-sm text-gray-800 leading-relaxed;
}

.card-footer {
  @apply flex items-center justify-between;
}

.card-id {
  @apply text-xs text-blue-600 font-medium;
}

.card-meta {
  @apply flex items-center gap-2;
}



.dot {
  @apply w-1 h-1 rounded-full;
}




.assignees {
  @apply flex items-center gap-1 flex-wrap;
}

.assignee {
  @apply w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium;
}

.drop-indicator {
  @apply h-0.5 bg-blue-500 mx-2 rounded-full transition-opacity duration-200;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.empty-column {
  @apply text-center py-8;
}

.empty-text {
  @apply text-sm text-gray-500;
}

.create-btn {
  @apply flex items-center w-full p-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors mt-2 cursor-pointer;
}

.create-card-input-container {
  @apply w-full p-2 bg-white border-2 border-blue-400 rounded-md mt-2;
}

.create-card-input {
  @apply w-full text-sm text-gray-800 bg-transparent border-none outline-none placeholder-gray-400;
}

/* Add column styles */
.add-column-container {
  @apply flex-shrink-0 w-80;
  height: 100%;
  display: flex;
  align-items: flex-start;
}

.add-column-btn {
  @apply flex items-center justify-center w-full h-20 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer;
}

.add-column-input-container {
  @apply w-full h-20 bg-white border-2 border-blue-400 rounded-lg p-3 flex items-center;
}

.add-column-input {
  @apply w-full text-sm font-semibold text-gray-700 uppercase tracking-wide bg-transparent border-none outline-none placeholder-gray-400;
}

/* Modal styles */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200;
}

.task-modal {
  @apply max-w-lg;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-close {
  @apply p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors;
}

.modal-form {
  @apply p-6;
}

.modal-actions {
  @apply flex items-center justify-between px-6 py-4 bg-gray-50 rounded-b-lg;
}

/* Form styles */
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none;
}

/* Checkbox styles for assignees */
.assignee-checkboxes {
  @apply max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2;
}

.checkbox-label {
  @apply flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer;
}

.checkbox-input {
  @apply w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2;
}

.checkbox-text {
  @apply text-sm text-gray-700;
}

/* Button styles */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 bg-white text-gray-700 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors;
}

.btn-danger {
  @apply px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors;
}

.mr-auto {
  margin-right: auto;
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoom-in {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}

.animate-in {
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fade-in;
}

.zoom-in {
  animation-name: zoom-in;
}

.duration-200 {
  animation-duration: 200ms;
}

/* Touch support */
@media (hover: none) and (pointer: coarse) {
  .kanban-card {
    touch-action: none;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .kanban-container {
    @apply flex-col;
  }
  
  .kanban-column, .add-column-container {
    @apply w-full;
  }
  
  .modal-content, .task-modal {
    @apply mx-2 max-w-none;
  }
}
</style>