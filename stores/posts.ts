import { defineStore } from 'pinia'
import { faker } from '@faker-js/faker'

export interface Post {
  id: string
  content: string
  platforms: Platform[]
  scheduledTime: Date | null
  publishedTime: Date | null
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  media: MediaItem[]
  analytics?: PostAnalytics
  createdAt: Date
  updatedAt: Date
}

export interface Platform {
  id: string
  name: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok'
  characterLimit: number
  isConnected: boolean
}

export interface MediaItem {
  id: string
  type: 'image' | 'video' | 'gif'
  url: string
  thumbnail?: string
  alt?: string
  size: number
}

export interface PostAnalytics {
  views: number
  likes: number
  shares: number
  comments: number
  clickThroughRate: number
  engagementRate: number
  reachRate: number
  impressions: number
  sparklineData: number[]
  emotionDistribution: {
    positive: number
    neutral: number
    negative: number
  }
}

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as Post[],
    platforms: [
      { id: '1', name: 'twitter', characterLimit: 280, isConnected: true },
      { id: '2', name: 'facebook', characterLimit: 2200, isConnected: true },
      { id: '3', name: 'instagram', characterLimit: 2200, isConnected: false },
      { id: '4', name: 'linkedin', characterLimit: 3000, isConnected: true },
      { id: '5', name: 'tiktok', characterLimit: 150, isConnected: false },
    ] as Platform[],
    currentFilter: 'all' as 'all' | 'draft' | 'scheduled' | 'published',
    searchQuery: '',
    isLoading: false,
    error: null as string | null,
    selectedPosts: [] as string[],
    calendarView: 'month' as 'week' | 'month',
    consistencyStreak: 0,
  }),

  getters: {
    filteredPosts: (state) => {
      let filtered = state.posts

      if (state.currentFilter !== 'all') {
        filtered = filtered.filter(post => post.status === state.currentFilter)
      }

      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(post => 
          post.content.toLowerCase().includes(query) ||
          post.platforms.some(platform => platform.name.includes(query))
        )
      }

      return filtered.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    },

    scheduledPosts: (state) => {
      return state.posts
        .filter(post => post.status === 'scheduled')
        .sort((a, b) => {
          if (!a.scheduledTime || !b.scheduledTime) return 0
          return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
        })
    },

    publishedPosts: (state) => {
      return state.posts
        .filter(post => post.status === 'published')
        .sort((a, b) => {
          if (!a.publishedTime || !b.publishedTime) return 0
          return new Date(b.publishedTime).getTime() - new Date(a.publishedTime).getTime()
        })
    },

    totalEngagement: (state) => {
      return state.posts
        .filter(post => post.analytics)
        .reduce((total, post) => {
          const analytics = post.analytics!
          return total + analytics.likes + analytics.shares + analytics.comments
        }, 0)
    },

    averageEngagementRate: (state) => {
      const publishedPosts = state.posts.filter(post => post.analytics)
      if (publishedPosts.length === 0) return 0
      
      const totalRate = publishedPosts.reduce((sum, post) => {
        return sum + (post.analytics?.engagementRate || 0)
      }, 0)
      
      return Math.round((totalRate / publishedPosts.length) * 100) / 100
    },

    connectedPlatforms: (state) => {
      return state.platforms.filter(platform => platform.isConnected)
    },

    upcomingPosts: (state) => {
      const now = new Date()
      return state.posts
        .filter(post => 
          post.status === 'scheduled' && 
          post.scheduledTime && 
          new Date(post.scheduledTime) > now
        )
        .slice(0, 5)
    },

    postsByDate: (state) => {
      const postMap = new Map<string, Post[]>()
      
      state.posts.forEach(post => {
        const date = post.scheduledTime || post.publishedTime || post.createdAt
        const dateKey = new Date(date).toISOString().split('T')[0]
        
        if (!postMap.has(dateKey)) {
          postMap.set(dateKey, [])
        }
        postMap.get(dateKey)!.push(post)
      })
      
      return postMap
    }
  },

  actions: {
    async initializeMockData() {
      if (this.posts.length > 0) return

      this.isLoading = true
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate mock posts
      for (let i = 0; i < 25; i++) {
        const post = this.generateMockPost()
        this.posts.push(post)
      }

      // Calculate consistency streak
      this.calculateConsistencyStreak()
      
      this.isLoading = false
    },

    generateMockPost(): Post {
      const status = faker.helpers.arrayElement(['draft', 'scheduled', 'published', 'published', 'published']) as Post['status']
      const platforms = faker.helpers.arrayElements(this.platforms, { min: 1, max: 3 })
      
      const scheduledTime = status === 'scheduled' 
        ? faker.date.future()
        : status === 'published'
        ? faker.date.recent({ days: 30 })
        : null

      const publishedTime = status === 'published' ? scheduledTime : null

      const analytics = status === 'published' ? {
        views: faker.number.int({ min: 100, max: 10000 }),
        likes: faker.number.int({ min: 5, max: 500 }),
        shares: faker.number.int({ min: 0, max: 100 }),
        comments: faker.number.int({ min: 0, max: 50 }),
        clickThroughRate: faker.number.float({ min: 0.5, max: 8.5, multipleOf: 0.1 }),
        engagementRate: faker.number.float({ min: 1.0, max: 15.0, multipleOf: 0.1 }),
        reachRate: faker.number.float({ min: 10.0, max: 80.0, multipleOf: 0.1 }),
        impressions: faker.number.int({ min: 500, max: 50000 }),
        sparklineData: Array.from({ length: 7 }, () => faker.number.int({ min: 0, max: 100 })),
        emotionDistribution: {
          positive: faker.number.float({ min: 0.4, max: 0.8, multipleOf: 0.01 }),
          neutral: faker.number.float({ min: 0.1, max: 0.4, multipleOf: 0.01 }),
          negative: faker.number.float({ min: 0.05, max: 0.3, multipleOf: 0.01 }),
        }
      } : undefined

      return {
        id: faker.string.uuid(),
        content: faker.lorem.paragraph({ min: 1, max: 3 }),
        platforms,
        scheduledTime,
        publishedTime,
        status,
        media: this.generateMockMedia(),
        analytics,
        createdAt: faker.date.recent({ days: 60 }),
        updatedAt: faker.date.recent({ days: 30 })
      }
    },

    generateMockMedia(): MediaItem[] {
      const count = faker.number.int({ min: 0, max: 4 })
      return Array.from({ length: count }, () => ({
        id: faker.string.uuid(),
        type: faker.helpers.arrayElement(['image', 'video', 'gif']) as MediaItem['type'],
        url: faker.image.url({ width: 800, height: 600 }),
        thumbnail: faker.image.url({ width: 200, height: 150 }),
        alt: faker.lorem.sentence(),
        size: faker.number.int({ min: 100000, max: 5000000 })
      }))
    },

    createPost(postData: Partial<Post>): Post {
      const newPost: Post = {
        id: faker.string.uuid(),
        content: postData.content || '',
        platforms: postData.platforms || [],
        scheduledTime: postData.scheduledTime || null,
        publishedTime: null,
        status: 'draft',
        media: postData.media || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...postData
      }

      this.posts.unshift(newPost)
      this.saveToLocalStorage()
      return newPost
    },

    updatePost(id: string, updates: Partial<Post>) {
      const index = this.posts.findIndex(post => post.id === id)
      if (index !== -1) {
        this.posts[index] = {
          ...this.posts[index],
          ...updates,
          updatedAt: new Date()
        }
        this.saveToLocalStorage()
      }
    },

    deletePost(id: string) {
      const index = this.posts.findIndex(post => post.id === id)
      if (index !== -1) {
        this.posts.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    duplicatePost(id: string) {
      const post = this.posts.find(p => p.id === id)
      if (post) {
        const duplicated = {
          ...post,
          id: faker.string.uuid(),
          content: `Copy of ${post.content}`,
          status: 'draft' as const,
          scheduledTime: null,
          publishedTime: null,
          analytics: undefined,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        this.posts.unshift(duplicated)
        this.saveToLocalStorage()
        return duplicated
      }
    },

    schedulePost(id: string, scheduledTime: Date) {
      this.updatePost(id, {
        scheduledTime,
        status: 'scheduled'
      })
      
      // Trigger haptic feedback simulation
      this.triggerHapticFeedback()
    },

    publishPost(id: string) {
      this.updatePost(id, {
        status: 'published',
        publishedTime: new Date()
      })
      
      // Update consistency streak
      this.calculateConsistencyStreak()
    },

    bulkAction(action: 'delete' | 'schedule' | 'publish', postIds: string[], scheduledTime?: Date) {
      postIds.forEach(id => {
        switch (action) {
          case 'delete':
            this.deletePost(id)
            break
          case 'schedule':
            if (scheduledTime) this.schedulePost(id, scheduledTime)
            break
          case 'publish':
            this.publishPost(id)
            break
        }
      })
      this.selectedPosts = []
    },

    setFilter(filter: typeof this.currentFilter) {
      this.currentFilter = filter
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    togglePostSelection(id: string) {
      const index = this.selectedPosts.indexOf(id)
      if (index === -1) {
        this.selectedPosts.push(id)
      } else {
        this.selectedPosts.splice(index, 1)
      }
    },

    clearSelection() {
      this.selectedPosts = []
    },

    selectAll() {
      this.selectedPosts = this.filteredPosts.map(post => post.id)
    },

    getPlatformCharacterLimit(platformNames: string[]): number {
      const limits = platformNames.map(name => {
        const platform = this.platforms.find(p => p.name === name)
        return platform?.characterLimit || 280
      })
      return Math.min(...limits)
    },

    getOptimalPostTime(platform: string): Date {
      // Mock AI-powered optimal time suggestion
      const now = new Date()
      const optimalHours = {
        twitter: [9, 12, 15, 18],
        facebook: [10, 14, 16, 19],
        instagram: [11, 13, 17, 20],
        linkedin: [8, 12, 17],
        tiktok: [15, 18, 21]
      }

      const hours = optimalHours[platform as keyof typeof optimalHours] || [12]
      const randomHour = faker.helpers.arrayElement(hours)
      
      const optimal = new Date(now)
      optimal.setHours(randomHour, 0, 0, 0)
      
      // If the time has passed today, schedule for tomorrow
      if (optimal <= now) {
        optimal.setDate(optimal.getDate() + 1)
      }
      
      return optimal
    },

    calculateConsistencyStreak() {
      const publishedDates = this.posts
        .filter(post => post.status === 'published' && post.publishedTime)
        .map(post => new Date(post.publishedTime!).toDateString())
        .sort()

      const uniqueDates = [...new Set(publishedDates)]
      
      let streak = 0
      const today = new Date()
      
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(today.getDate() - i)
        const dateString = checkDate.toDateString()
        
        if (uniqueDates.includes(dateString)) {
          streak++
        } else if (i > 0) {
          break
        }
      }
      
      this.consistencyStreak = streak
    },

    triggerHapticFeedback() {
      // Simulate haptic feedback with a brief sound/animation
      if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        navigator.vibrate?.(100)
      }
    },

    saveToLocalStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('postify-posts', JSON.stringify(this.posts))
        localStorage.setItem('postify-streak', this.consistencyStreak.toString())
      }
    },

    loadFromLocalStorage() {
      if (typeof window !== 'undefined') {
        const savedPosts = localStorage.getItem('postify-posts')
        const savedStreak = localStorage.getItem('postify-streak')
        
        if (savedPosts) {
          this.posts = JSON.parse(savedPosts)
        }
        
        if (savedStreak) {
          this.consistencyStreak = parseInt(savedStreak, 10)
        }
      }
    }
  }
})
