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
          <h3 class="column-title">{{ column.title }}</h3>
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
            >
              <!-- Card Content -->
              <div class="card-content">
                <p class="card-title">{{ card.title }}</p>
                <div class="card-footer">
                  <span class="card-id">{{ card.id }}</span>
                  <div class="card-meta">
                    <div 
                      v-if="card.priority" 
                      class="priority-indicator"
                      :class="`priority-${card.priority}`"
                    >
                      <div class="priority-dots">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                      </div>
                    </div>
                    <div v-if="card.assignee" class="assignee">
                      {{ card.assignee }}
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
          
          <button class="create-btn">
            <Plus class="w-4 h-4 mr-2" />
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ChevronDown, Maximize2, MoreHorizontal, Plus } from 'lucide-vue-next'

// Sample data matching Jira structure
const columns = ref([
  {
    id: 'selected',
    title: 'SELECTED FOR DEVELOPMENT',
    cards: [
      {
        id: 'EL-18',
        title: 'lskdjfl dsmlfijks dfmlskdg sdmlfjs dgksdg sdmlkg gsmkg',
        priority: 'medium',
        assignee: 'EI'
      }
    ]
  },
  {
    id: 'progress',
    title: 'IN PROGRESS',
    cards: [
      {
        id: 'EL-16',
        title: 'change back ground and button design',
        priority: 'high',
        assignee: 'EI'
      }
    ]
  },
  {
    id: 'backlog',
    title: 'BACKLOG',
    cards: [
      {
        id: 'EL-17',
        title: 'this is tes t',
        assignee: 'EI'
      },
      {
        id: 'EL-20',
        title: 'lmdfkg',
        assignee: 'EI'
      },
      {
        id: 'EL-19',
        title: 'dlkg',
        assignee: 'EI'
      }
    ]
  },
  {
    id: 'done',
    title: 'DONE',
    cards: [
      {
        id: 'EL-18',
        title: 'lskdjfl dsmlfijks dfmlskdg sdmlfjs dgksdg sdmlkg gsmkg',
        priority: 'medium',
        assignee: 'EI'
      }
    ]
  }
])

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
}

.kanban-column {
  @apply flex-shrink-0 w-80 bg-gray-100 rounded-lg p-3 transition-all duration-200;
}

.kanban-column.drop-target {
  @apply bg-blue-50 border-l-4 border-blue-400;
}

.column-header {
  @apply flex items-center justify-between mb-4;
}

.column-title {
  @apply text-sm font-semibold text-gray-700 uppercase tracking-wide;
}

.column-count {
  @apply text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full;
}

.cards-container {
  @apply space-y-2;
}

.card-wrapper {
  @apply relative;
}

.kanban-card {
  @apply bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-grab transition-all duration-150;
  will-change: transform;
}

.kanban-card:hover {
  @apply shadow-md transform scale-[1.01];
}

.kanban-card.dragging {
  @apply opacity-90 scale-[1.02] shadow-lg z-50 cursor-grabbing;
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

.priority-indicator {
  @apply flex items-center;
}

.priority-dots {
  @apply flex gap-0.5;
}

.dot {
  @apply w-1 h-1 rounded-full;
}

.priority-high .dot {
  @apply bg-red-500;
}

.priority-medium .dot {
  @apply bg-orange-500;
}

.priority-low .dot {
  @apply bg-green-500;
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
  @apply flex items-center w-full p-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors mt-2;
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
  
  .kanban-column {
    @apply w-full;
  }
}
</style>