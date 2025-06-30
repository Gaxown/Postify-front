import { defineStore } from 'pinia'
import localforage from 'localforage'
import { faker } from '@faker-js/faker'

export interface KanbanTask {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
  assignee?: string
  dueDate?: Date
  tags: string[]
  createdAt: Date
  updatedAt: Date
  position: number
  estimatedHours?: number
  actualHours?: number
  platform?: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok'
  color?: string
}

export interface KanbanColumn {
  id: string
  title: string
  status: KanbanTask['status']
  color: string
  limit?: number
  position: number
}

export interface DragState {
  isDragging: boolean
  draggedTask: KanbanTask | null
  sourceColumn: string | null
  targetColumn: string | null
  dropIndicator: {
    isVisible: boolean
    position: number
    columnId: string | null
  }
}

const defaultColumns: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog', status: 'backlog', color: 'slate', position: 0 },
  { id: 'todo', title: 'To Do', status: 'todo', color: 'blue', position: 1, limit: 8 },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress', color: 'yellow', position: 2, limit: 5 },
  { id: 'review', title: 'Review', status: 'review', color: 'purple', position: 3, limit: 3 },
  { id: 'done', title: 'Done', status: 'done', color: 'green', position: 4 }
]

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    tasks: [] as KanbanTask[],
    columns: [...defaultColumns] as KanbanColumn[],
    dragState: {
      isDragging: false,
      draggedTask: null,
      sourceColumn: null,
      targetColumn: null,
      dropIndicator: {
        isVisible: false,
        position: 0,
        columnId: null
      }
    } as DragState,
    isLoading: false,
    error: null as string | null,
    selectedTasks: [] as string[],
    searchQuery: '',
    filterBy: {
      priority: null as KanbanTask['priority'] | null,
      assignee: null as string | null,
      tags: [] as string[],
      platform: null as KanbanTask['platform'] | null
    },
    undoStack: [] as Array<{
      action: string
      data: any
      timestamp: Date
    }>,
    autoScrollEdges: {
      left: false,
      right: false
    }
  }),

  getters: {
    tasksByColumn: (state) => (columnId: string) => {
      return state.tasks
        .filter(task => task.status === state.columns.find(col => col.id === columnId)?.status)
        .sort((a, b) => a.position - b.position)
    },

    filteredTasks: (state) => {
      let filtered = state.tasks

      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(task =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }

      if (state.filterBy.priority) {
        filtered = filtered.filter(task => task.priority === state.filterBy.priority)
      }

      if (state.filterBy.assignee) {
        filtered = filtered.filter(task => task.assignee === state.filterBy.assignee)
      }

      if (state.filterBy.tags.length > 0) {
        filtered = filtered.filter(task =>
          state.filterBy.tags.some(tag => task.tags.includes(tag))
        )
      }

      if (state.filterBy.platform) {
        filtered = filtered.filter(task => task.platform === state.filterBy.platform)
      }

      return filtered
    },

    urgentTasks: (state) => {
      const now = new Date()
      const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000)
      
      return state.tasks.filter(task => 
        task.dueDate && 
        new Date(task.dueDate) <= in48Hours &&
        task.status !== 'done'
      )
    },

    completionRate: (state) => {
      if (state.tasks.length === 0) return 0
      const completed = state.tasks.filter(task => task.status === 'done').length
      return Math.round((completed / state.tasks.length) * 100)
    },

    columnStats: (state) => {
      return state.columns.map(column => ({
        ...column,
        taskCount: state.tasks.filter(task => task.status === column.status).length,
        isOverLimit: column.limit ? 
          state.tasks.filter(task => task.status === column.status).length > column.limit : 
          false
      }))
    },

    allTags: (state) => {
      const tags = new Set<string>()
      state.tasks.forEach(task => {
        task.tags.forEach(tag => tags.add(tag))
      })
      return Array.from(tags).sort()
    },

    allAssignees: (state) => {
      const assignees = new Set<string>()
      state.tasks.forEach(task => {
        if (task.assignee) assignees.add(task.assignee)
      })
      return Array.from(assignees).sort()
    }
  },

  actions: {
    // Task Management
    async createTask(taskData: Partial<KanbanTask>): Promise<KanbanTask> {
      const position = this.getNextPosition(taskData.status || 'todo')
      
      const newTask: KanbanTask = {
        id: faker.string.uuid(),
        title: taskData.title || 'New Task',
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
        assignee: taskData.assignee,
        dueDate: taskData.dueDate,
        tags: taskData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        position,
        estimatedHours: taskData.estimatedHours,
        actualHours: taskData.actualHours,
        platform: taskData.platform,
        color: taskData.color || this.generateTaskColor(taskData.priority || 'medium')
      }

      this.tasks.unshift(newTask)
      this.reorderTasksInColumn(newTask.status)
      await this.saveToStorage()
      
      // Add to undo stack
      this.addToUndoStack('create', newTask)
      
      return newTask
    },

    async updateTask(id: string, updates: Partial<KanbanTask>) {
      const taskIndex = this.tasks.findIndex(task => task.id === id)
      if (taskIndex === -1) return

      const oldTask = { ...this.tasks[taskIndex] }
      
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        ...updates,
        updatedAt: new Date()
      }

      // If status changed, reorder positions
      if (updates.status && updates.status !== oldTask.status) {
        this.reorderTasksInColumn(oldTask.status)
        this.reorderTasksInColumn(updates.status)
      }

      await this.saveToStorage()
      
      // Add to undo stack
      this.addToUndoStack('update', { id, oldTask, updates })
    },

    async deleteTask(id: string) {
      const taskIndex = this.tasks.findIndex(task => task.id === id)
      if (taskIndex === -1) return

      const deletedTask = this.tasks[taskIndex]
      this.tasks.splice(taskIndex, 1)
      
      // Reorder remaining tasks in column
      this.reorderTasksInColumn(deletedTask.status)
      
      await this.saveToStorage()
      
      // Add to undo stack
      this.addToUndoStack('delete', deletedTask)
    },

    async duplicateTask(id: string) {
      const originalTask = this.tasks.find(task => task.id === id)
      if (!originalTask) return

      const duplicated = {
        ...originalTask,
        id: faker.string.uuid(),
        title: `Copy of ${originalTask.title}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        position: this.getNextPosition(originalTask.status)
      }

      this.tasks.push(duplicated)
      this.reorderTasksInColumn(duplicated.status)
      await this.saveToStorage()
      
      return duplicated
    },

    // Drag & Drop
    startDrag(task: KanbanTask) {
      this.dragState.isDragging = true
      this.dragState.draggedTask = task
      this.dragState.sourceColumn = this.columns.find(col => col.status === task.status)?.id || null
    },

    endDrag() {
      this.dragState.isDragging = false
      this.dragState.draggedTask = null
      this.dragState.sourceColumn = null
      this.dragState.targetColumn = null
      this.hideDropIndicator()
    },

    setTargetColumn(columnId: string | null) {
      this.dragState.targetColumn = columnId
    },

    showDropIndicator(columnId: string, position: number) {
      this.dragState.dropIndicator = {
        isVisible: true,
        position,
        columnId
      }
    },

    hideDropIndicator() {
      this.dragState.dropIndicator = {
        isVisible: false,
        position: 0,
        columnId: null
      }
    },

    async moveTask(taskId: string, targetStatus: KanbanTask['status'], targetPosition?: number) {
      const task = this.tasks.find(t => t.id === taskId)
      if (!task) return

      const oldStatus = task.status
      const oldPosition = task.position

      // Update task status
      task.status = targetStatus
      task.updatedAt = new Date()

      // Handle position
      if (targetPosition !== undefined) {
        task.position = targetPosition
      } else {
        task.position = this.getNextPosition(targetStatus)
      }

      // Reorder tasks in both columns
      this.reorderTasksInColumn(oldStatus)
      this.reorderTasksInColumn(targetStatus)

      await this.saveToStorage()
      
      // Add to undo stack
      this.addToUndoStack('move', {
        taskId,
        oldStatus,
        newStatus: targetStatus,
        oldPosition,
        newPosition: task.position
      })

      // Trigger haptic feedback
      this.triggerHapticFeedback()
    },

    async reorderTaskInColumn(taskId: string, newPosition: number) {
      const task = this.tasks.find(t => t.id === taskId)
      if (!task) return

      const oldPosition = task.position
      task.position = newPosition
      task.updatedAt = new Date()

      this.reorderTasksInColumn(task.status)
      await this.saveToStorage()
      
      // Add to undo stack
      this.addToUndoStack('reorder', {
        taskId,
        oldPosition,
        newPosition,
        status: task.status
      })
    },

    // Utility functions
    generateMockTasks(count: number = 20) {
      const platforms = ['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok'] as const
      const assignees = ['Alex Chen', 'Sarah Wilson', 'Mike Johnson', 'Emma Davis', 'David Kim']
      const tagSets = [
        ['content', 'social', 'urgent'],
        ['design', 'visual', 'review'],
        ['copy', 'writing', 'approval'],
        ['video', 'editing', 'tiktok'],
        ['analytics', 'report', 'weekly'],
        ['campaign', 'launch', 'priority'],
        ['bug', 'fix', 'technical'],
        ['feature', 'enhancement', 'user-request']
      ]

      for (let i = 0; i < count; i++) {
        const status = faker.helpers.arrayElement(['backlog', 'todo', 'in-progress', 'review', 'done'] as const)
        const priority = faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent'] as const)
        const platform = faker.helpers.arrayElement(platforms)
        const assignee = faker.helpers.arrayElement(assignees)
        const tags = faker.helpers.arrayElement(tagSets)
        
        const task: KanbanTask = {
          id: faker.string.uuid(),
          title: faker.company.catchPhrase(),
          description: faker.lorem.paragraph(),
          priority,
          status,
          assignee,
          dueDate: faker.date.future(),
          tags,
          createdAt: faker.date.recent({ days: 30 }),
          updatedAt: faker.date.recent({ days: 7 }),
          position: this.getNextPosition(status),
          estimatedHours: faker.number.int({ min: 1, max: 8 }),
          actualHours: status === 'done' ? faker.number.int({ min: 1, max: 10 }) : undefined,
          platform,
          color: this.generateTaskColor(priority)
        }

        this.tasks.push(task)
      }

      // Reorder all columns
      this.columns.forEach(column => {
        this.reorderTasksInColumn(column.status)
      })
    },

    generateTaskColor(priority: KanbanTask['priority']): string {
      const colors = {
        low: '#10b981',    // green
        medium: '#3b82f6', // blue  
        high: '#f59e0b',   // amber
        urgent: '#ef4444'  // red
      }
      return colors[priority]
    },

    getNextPosition(status: KanbanTask['status']): number {
      const tasksInColumn = this.tasks.filter(task => task.status === status)
      if (tasksInColumn.length === 0) return 0
      return Math.max(...tasksInColumn.map(task => task.position)) + 1
    },

    reorderTasksInColumn(status: KanbanTask['status']) {
      const tasksInColumn = this.tasks
        .filter(task => task.status === status)
        .sort((a, b) => a.position - b.position)

      tasksInColumn.forEach((task, index) => {
        task.position = index
      })
    },

    // Filter & Search
    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    setFilter(filterKey: keyof typeof this.filterBy, value: any) {
      this.filterBy[filterKey] = value
    },

    clearFilters() {
      this.filterBy = {
        priority: null,
        assignee: null,
        tags: [],
        platform: null
      }
      this.searchQuery = ''
    },

    // Selection
    toggleTaskSelection(taskId: string) {
      const index = this.selectedTasks.indexOf(taskId)
      if (index === -1) {
        this.selectedTasks.push(taskId)
      } else {
        this.selectedTasks.splice(index, 1)
      }
    },

    selectAllTasks() {
      this.selectedTasks = this.filteredTasks.map(task => task.id)
    },

    clearSelection() {
      this.selectedTasks = []
    },

    // Bulk Actions
    async bulkUpdateTasks(taskIds: string[], updates: Partial<KanbanTask>) {
      const oldTasks = taskIds.map(id => {
        const task = this.tasks.find(t => t.id === id)
        return task ? { ...task } : null
      }).filter(Boolean)

      for (const id of taskIds) {
        await this.updateTask(id, updates)
      }

      // Add to undo stack
      this.addToUndoStack('bulk-update', { taskIds, oldTasks, updates })
      
      this.clearSelection()
    },

    async bulkDeleteTasks(taskIds: string[]) {
      const deletedTasks = taskIds.map(id => {
        const task = this.tasks.find(t => t.id === id)
        return task ? { ...task } : null
      }).filter(Boolean)

      for (const id of taskIds) {
        await this.deleteTask(id)
      }

      // Add to undo stack
      this.addToUndoStack('bulk-delete', deletedTasks)
      
      this.clearSelection()
    },

    // Undo System
    addToUndoStack(action: string, data: any) {
      this.undoStack.push({
        action,
        data,
        timestamp: new Date()
      })

      // Keep only last 50 actions
      if (this.undoStack.length > 50) {
        this.undoStack.shift()
      }
    },

    async undo() {
      const lastAction = this.undoStack.pop()
      if (!lastAction) return

      const { action, data } = lastAction

      switch (action) {
        case 'create':
          await this.deleteTask(data.id)
          break
        
        case 'delete':
          this.tasks.push(data)
          await this.saveToStorage()
          break
        
        case 'update':
          const taskIndex = this.tasks.findIndex(t => t.id === data.id)
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = data.oldTask
            await this.saveToStorage()
          }
          break
        
        case 'move':
          await this.moveTask(data.taskId, data.oldStatus, data.oldPosition)
          break
        
        case 'bulk-delete':
          for (const task of data) {
            this.tasks.push(task)
          }
          await this.saveToStorage()
          break
      }
    },

    // Edge Auto-scroll
    setAutoScrollEdge(edge: 'left' | 'right', active: boolean) {
      this.autoScrollEdges[edge] = active
    },

    // Storage
    async saveToStorage() {
      try {
        await localforage.setItem('kanban-tasks', this.tasks)
        await localforage.setItem('kanban-columns', this.columns)
      } catch (error) {
        console.error('Failed to save to storage:', error)
        this.error = 'Failed to save changes'
      }
    },

    async loadFromStorage() {
      try {
        this.isLoading = true
        
        const savedTasks = await localforage.getItem<KanbanTask[]>('kanban-tasks')
        const savedColumns = await localforage.getItem<KanbanColumn[]>('kanban-columns')
        
        if (savedTasks) {
          this.tasks = savedTasks
        } else {
          // Generate mock data if no saved tasks
          this.generateMockTasks()
        }
        
        if (savedColumns) {
          this.columns = savedColumns
        }
        
        this.isLoading = false
      } catch (error) {
        console.error('Failed to load from storage:', error)
        this.error = 'Failed to load data'
        this.isLoading = false
      }
    },

    // Haptic Feedback
    triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
      if (typeof window !== 'undefined' && 'navigator' in window) {
        const duration = {
          light: 50,
          medium: 100,
          heavy: 200
        }
        
        navigator.vibrate?.(duration[type])
      }
    },

    // Initialization
    async initialize() {
      await this.loadFromStorage()
    }
  }
})
