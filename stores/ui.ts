import { defineStore } from 'pinia'

export interface CommandPaletteCommand {
  id: string
  title: string
  description?: string
  icon?: string
  shortcut?: string
  action: () => void | Promise<void>
  group?: string
}

export const useUIStore = defineStore('ui', {
  state: () => ({
    isDarkMode: false,
    isCommandPaletteOpen: false,
    isSidebarCollapsed: false,
    isLoading: false,
    notification: null as {
      id: string
      type: 'success' | 'error' | 'warning' | 'info'
      title: string
      message?: string
      duration?: number
    } | null,
    confettiActive: false,
    contextMenu: null as {
      x: number
      y: number
      items: Array<{
        label: string
        icon?: string
        action: () => void
        disabled?: boolean
        separator?: boolean
      }>
    } | null,
    dragState: {
      isDragging: false,
      dragType: null as 'post' | 'media' | null,
      dragData: null as any
    },
    textSelection: {
      isActive: false,
      text: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    modalStack: [] as string[],
    breadcrumbs: [] as Array<{
      label: string
      path?: string
      isActive?: boolean
    }>,
    keyboardShortcuts: {
      'cmd+n': 'New Post',
      'cmd+/': 'Command Palette',
      'cmd+left': 'Previous Account',
      'cmd+right': 'Next Account',
      'cmd+k': 'Search',
      'cmd+d': 'Duplicate Post',
      'cmd+s': 'Save Draft',
      'cmd+enter': 'Schedule Post',
      'escape': 'Close Modal/Palette'
    } as Record<string, string>
  }),

  getters: {
    activeModal: (state) => {
      return state.modalStack[state.modalStack.length - 1] || null
    },

    hasActiveModal: (state) => {
      return state.modalStack.length > 0
    },

    theme: (state) => {
      return state.isDarkMode ? 'dark' : 'light'
    },

    availableCommands(): CommandPaletteCommand[] {
      const postsStore = usePostsStore()
      
      return [
        {
          id: 'new-post',
          title: 'New Post',
          description: 'Create a new social media post',
          icon: 'plus',
          shortcut: '⌘ N',
          group: 'Posts',
          action: () => {
            navigateTo('/compose')
            this.closeCommandPalette()
          }
        },
        {
          id: 'search-posts',
          title: 'Search Posts',
          description: 'Search through your posts',
          icon: 'search',
          shortcut: '⌘ K',
          group: 'Navigation',
          action: () => {
            // Focus search input
            this.closeCommandPalette()
          }
        },
        {
          id: 'toggle-theme',
          title: `Switch to ${this.isDarkMode ? 'Light' : 'Dark'} Mode`,
          description: 'Toggle between light and dark themes',
          icon: this.isDarkMode ? 'sun' : 'moon',
          group: 'Settings',
          action: () => {
            this.toggleTheme()
            this.closeCommandPalette()
          }
        },
        {
          id: 'go-to-dashboard',
          title: 'Go to Dashboard',
          description: 'Navigate to the main dashboard',
          icon: 'home',
          group: 'Navigation',
          action: () => {
            navigateTo('/')
            this.closeCommandPalette()
          }
        },
        {
          id: 'go-to-analytics',
          title: 'Go to Analytics',
          description: 'View your post analytics',
          icon: 'chart-bar',
          group: 'Navigation',
          action: () => {
            navigateTo('/analytics')
            this.closeCommandPalette()
          }
        },
        {
          id: 'go-to-calendar',
          title: 'Go to Calendar',
          description: 'View your posting calendar',
          icon: 'calendar',
          group: 'Navigation',
          action: () => {
            navigateTo('/calendar')
            this.closeCommandPalette()
          }
        },
        {
          id: 'clear-all-drafts',
          title: 'Clear All Drafts',
          description: 'Delete all draft posts',
          icon: 'trash',
          group: 'Posts',
          action: async () => {
            const drafts = postsStore.posts.filter(p => p.status === 'draft')
            for (const draft of drafts) {
              postsStore.deletePost(draft.id)
            }
            this.showNotification({
              type: 'success',
              title: 'Drafts Cleared',
              message: `Deleted ${drafts.length} draft posts`,
              duration: 3000
            })
            this.closeCommandPalette()
          }
        },
        {
          id: 'export-posts',
          title: 'Export Posts',
          description: 'Export your posts as JSON',
          icon: 'download',
          group: 'Data',
          action: () => {
            this.exportPosts()
            this.closeCommandPalette()
          }
        }
      ]
    }
  },

  actions: {
    // Theme Management
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode
      this.applyTheme()
      this.savePreferences()
    },

    setTheme(theme: 'light' | 'dark') {
      this.isDarkMode = theme === 'dark'
      this.applyTheme()
      this.savePreferences()
    },

    applyTheme() {
      if (typeof document !== 'undefined') {
        if (this.isDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    },

    // Command Palette
    openCommandPalette() {
      this.isCommandPaletteOpen = true
    },

    closeCommandPalette() {
      this.isCommandPaletteOpen = false
    },

    toggleCommandPalette() {
      this.isCommandPaletteOpen = !this.isCommandPaletteOpen
    },

    executeCommand(commandId: string) {
      const command = this.availableCommands.find(cmd => cmd.id === commandId)
      if (command) {
        command.action()
      }
    },

    // Notifications
    showNotification(notification: Omit<typeof this.notification, 'id'>) {
      this.notification = {
        id: Date.now().toString(),
        duration: 5000,
        ...notification
      }

      if (notification.duration && notification.duration > 0) {
        setTimeout(() => {
          this.hideNotification()
        }, notification.duration)
      }
    },

    hideNotification() {
      this.notification = null
    },

    // Confetti Effect
    triggerConfetti() {
      this.confettiActive = true
      
      // Create confetti particles
      if (typeof document !== 'undefined') {
        this.createConfettiParticles()
      }
      
      setTimeout(() => {
        this.confettiActive = false
      }, 3000)
    },

    createConfettiParticles() {
      const colors = ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
      const particleCount = 50
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div')
        particle.className = 'confetti'
        particle.style.left = Math.random() * 100 + 'vw'
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        particle.style.animationDelay = Math.random() * 3 + 's'
        particle.style.animationDuration = (Math.random() * 2 + 1) + 's'
        
        document.body.appendChild(particle)
        
        setTimeout(() => {
          particle.remove()
        }, 3000)
      }
    },

    // Context Menu
    showContextMenu(x: number, y: number, items: typeof this.contextMenu.items) {
      this.contextMenu = { x, y, items }
    },

    hideContextMenu() {
      this.contextMenu = null
    },

    // Drag & Drop
    startDrag(type: 'post' | 'media', data: any) {
      this.dragState = {
        isDragging: true,
        dragType: type,
        dragData: data
      }
    },

    endDrag() {
      this.dragState = {
        isDragging: false,
        dragType: null,
        dragData: null
      }
    },

    // Text Selection
    setTextSelection(selection: {
      text: string
      x: number
      y: number
      width: number
      height: number
    }) {
      this.textSelection = {
        isActive: true,
        ...selection
      }
    },

    clearTextSelection() {
      this.textSelection = {
        isActive: false,
        text: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    },

    // Modal Management
    openModal(modalId: string) {
      this.modalStack.push(modalId)
    },

    closeModal(modalId?: string) {
      if (modalId) {
        const index = this.modalStack.indexOf(modalId)
        if (index !== -1) {
          this.modalStack.splice(index, 1)
        }
      } else {
        this.modalStack.pop()
      }
    },

    closeAllModals() {
      this.modalStack = []
    },

    // Breadcrumbs
    setBreadcrumbs(breadcrumbs: typeof this.breadcrumbs) {
      this.breadcrumbs = breadcrumbs
    },

    addBreadcrumb(breadcrumb: typeof this.breadcrumbs[0]) {
      this.breadcrumbs.push(breadcrumb)
    },

    // Sidebar
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
      this.savePreferences()
    },

    setSidebarCollapsed(collapsed: boolean) {
      this.isSidebarCollapsed = collapsed
      this.savePreferences()
    },

    // Keyboard Shortcuts
    registerKeyboardShortcuts() {
      if (typeof document === 'undefined') return

      document.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
        const cmdKey = isMac ? e.metaKey : e.ctrlKey
        
        // Command Palette
        if (cmdKey && e.key === '/') {
          e.preventDefault()
          this.toggleCommandPalette()
        }
        
        // New Post
        if (cmdKey && e.key === 'n') {
          e.preventDefault()
          navigateTo('/compose')
        }
        
        // Search
        if (cmdKey && e.key === 'k') {
          e.preventDefault()
          this.openCommandPalette()
        }
        
        // Close modals/palette with Escape
        if (e.key === 'Escape') {
          if (this.isCommandPaletteOpen) {
            this.closeCommandPalette()
          } else if (this.hasActiveModal) {
            this.closeModal()
          } else if (this.contextMenu) {
            this.hideContextMenu()
          } else if (this.textSelection.isActive) {
            this.clearTextSelection()
          }
        }
        
        // Theme toggle
        if (cmdKey && e.shiftKey && e.key === 'L') {
          e.preventDefault()
          this.toggleTheme()
        }
      })
    },

    // Easter Eggs
    checkForEasterEggs(text: string) {
      if (text.includes(':rocket:')) {
        // Remove the rocket text and trigger animation
        const newText = text.replace(':rocket:', '🚀')
        
        // Trigger rocket launch animation
        setTimeout(() => {
          const rockets = document.querySelectorAll('.rocket-launch')
          rockets.forEach(rocket => {
            rocket.classList.add('rocket-launch')
          })
        }, 100)
        
        return newText
      }
      
      return text
    },

    // Data Export
    exportPosts() {
      const postsStore = usePostsStore()
      const dataStr = JSON.stringify(postsStore.posts, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `postify-export-${new Date().toISOString().split('T')[0]}.json`
      
      if (typeof document !== 'undefined') {
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
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

    // Loading States
    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    // Persistence
    savePreferences() {
      if (typeof localStorage !== 'undefined') {
        const preferences = {
          isDarkMode: this.isDarkMode,
          isSidebarCollapsed: this.isSidebarCollapsed
        }
        localStorage.setItem('postify-preferences', JSON.stringify(preferences))
      }
    },

    loadPreferences() {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('postify-preferences')
        if (saved) {
          const preferences = JSON.parse(saved)
          this.isDarkMode = preferences.isDarkMode ?? false
          this.isSidebarCollapsed = preferences.isSidebarCollapsed ?? false
          this.applyTheme()
        }
      }
    },

    // Initialize UI
    initialize() {
      this.loadPreferences()
      this.registerKeyboardShortcuts()
      
      // Set initial theme based on system preference if not set
      if (typeof window !== 'undefined' && !localStorage.getItem('postify-preferences')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.setTheme(prefersDark ? 'dark' : 'light')
      }
    }
  }
})
