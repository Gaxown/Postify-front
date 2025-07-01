<template>
  <div class="calendar-container bg-white min-h-screen">
    <!-- Header -->
    <div class="header flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex items-center space-x-4">
        <button @click="goPrev" class="p-2 hover:bg-gray-100 rounded">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <button @click="goNext" class="p-2 hover:bg-gray-100 rounded">
          <ChevronRight class="w-5 h-5" />
        </button>
        
        <div class="relative">
          <button @click="showDatePicker = !showDatePicker" class="text-xl font-semibold hover:bg-gray-100 px-3 py-1 rounded">
            {{ currentMonthYear }}
          </button>
          
          <!-- Date Picker Dropdown -->
          <div v-if="showDatePicker" class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
            <div class="flex items-center justify-between mb-4">
              <button @click="prevMonth" class="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft class="w-4 h-4" />
              </button>
              <span class="font-semibold">{{ pickerMonthYear }}</span>
              <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
            
            <div class="grid grid-cols-7 gap-1 text-sm">
              <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="text-center text-gray-500 p-2">
                {{ day }}
              </div>
              <div v-for="date in pickerDates" :key="date.key" 
                   @click="selectDate(date)" 
                   :class="[
                     'text-center p-2 cursor-pointer rounded hover:bg-gray-100',
                     date.isToday ? 'bg-blue-500 text-white' : '',
                     date.isOtherMonth ? 'text-gray-300' : '',
                     date.isSelected ? 'bg-blue-100' : ''
                   ]">
                {{ date.day }}
              </div>
            </div>
          </div>
        </div>
        
        <button @click="resetToToday" class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
          Today
        </button>
      </div>
      
      <!-- View Toggle -->
      <div class="flex items-center space-x-2">
        <div class="relative">
          <button @click="showViewDropdown = !showViewDropdown" class="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
            <span>{{ viewMode.charAt(0).toUpperCase() + viewMode.slice(1) }}</span>
            <ChevronDown class="w-4 h-4" />
          </button>
          
          <div v-if="showViewDropdown" class="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button v-for="view in ['week', 'month', 'list']" :key="view"
                    @click="changeView(view)"
                    :class="[
                      'block w-full text-left px-4 py-2 hover:bg-gray-50',
                      viewMode === view ? 'bg-blue-50 text-blue-600' : ''
                    ]">
              {{ view.charAt(0).toUpperCase() + view.slice(1) }}
            </button>
          </div>
        </div>
        
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar class="w-4 h-4" />
          <span>All Posts</span>
          <ChevronDown class="w-4 h-4" />
        </div>
      </div>
    </div>

    <!-- Calendar Views -->
    <div class="calendar-content">
      <!-- Month View -->
      <div v-if="viewMode === 'month'" class="month-view">
        <div class="grid grid-cols-7 border-b border-gray-200">
          <div v-for="day in weekDays" :key="day" class="p-4 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0">
            {{ day }}
          </div>
        </div>
        
        <div class="grid grid-cols-7 auto-rows-fr min-h-[600px]">
          <div v-for="date in monthDates" :key="date.key" 
               :class="[
                 'border-r border-b border-gray-200 last:border-r-0 p-2 min-h-[120px]',
                 date.isOtherMonth ? 'bg-gray-50' : '',
                 date.isToday ? 'bg-blue-50' : ''
               ]"
               @drop="dropPost($event, date.date)"
               @dragover.prevent
               @dragenter.prevent>
            <div :class="[
              'text-sm font-medium mb-2',
              date.isToday ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : '',
              date.isOtherMonth ? 'text-gray-400' : ''
            ]">
              {{ date.day }}
            </div>
            
            <div class="space-y-1">
              <div v-for="post in getPostsForDate(date.date)" :key="post.id"
                   :class="[
                     'text-xs p-1 rounded cursor-move flex items-center space-x-1',
                     post.channel === 'twitter' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                   ]"
                   draggable="true"
                   @dragstart="dragStart(post)">
                <div class="w-3 h-3 rounded-full bg-gray-800 flex items-center justify-center text-white text-[8px]">
                  {{ post.channel === 'twitter' ? 'T' : 'I' }}
                </div>
                <span>{{ post.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Week View -->
      <div v-if="viewMode === 'week'" class="week-view">
        <div class="grid grid-cols-8 border-b border-gray-200">
          <div class="p-4"></div>
          <div v-for="date in weekDates" :key="date.key" class="p-4 text-center border-r border-gray-200 last:border-r-0">
            <div class="text-sm text-gray-500">{{ date.dayName }}</div>
            <div :class="[
              'text-lg font-semibold mt-1',
              date.isToday ? 'bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto' : ''
            ]">
              {{ date.day }}
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-8 auto-rows-fr">
          <div class="border-r border-gray-200">
            <div v-for="hour in timeSlots" :key="hour" class="h-16 border-b border-gray-200 p-2 text-xs text-gray-500">
              {{ hour }}
            </div>
          </div>
          
          <div v-for="date in weekDates" :key="date.key" class="border-r border-gray-200 last:border-r-0 relative">
            <div v-for="hour in timeSlots" :key="hour" 
                 class="h-16 border-b border-gray-200 relative"
                 @drop="dropPost($event, date.date, hour)"
                 @dragover.prevent
                 @dragenter.prevent>
              
              <div v-for="post in getPostsForDateTime(date.date, hour)" :key="post.id"
                   :class="[
                     'absolute left-1 right-1 p-2 rounded text-xs cursor-move',
                     post.channel === 'twitter' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                   ]"
                   :style="{ top: getPostPosition(post.time) + 'px' }"
                   draggable="true"
                   @dragstart="dragStart(post)">
                <div class="flex items-center space-x-2">
                  <div class="w-4 h-4 rounded-full bg-gray-800 flex items-center justify-center text-white text-[8px]">
                    {{ post.channel === 'twitter' ? 'T' : 'I' }}
                  </div>
                  <span class="font-medium">{{ post.time }}</span>
                </div>
                <div class="mt-1 text-gray-600 truncate">{{ post.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-if="viewMode === 'list'" class="list-view p-4">
        <div v-for="group in groupedPosts" :key="group.date" class="mb-6">
          <h3 class="text-lg font-semibold mb-3 text-gray-800">{{ group.dateLabel }}</h3>
          <div class="space-y-2">
            <div v-for="post in group.posts" :key="post.id"
                 :class="[
                   'p-3 rounded-lg border cursor-move flex items-center space-x-3',
                   post.channel === 'twitter' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'
                 ]"
                 draggable="true"
                 @dragstart="dragStart(post)">
              <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm">
                {{ post.channel === 'twitter' ? 'T' : 'I' }}
              </div>
              <div class="flex-1">
                <div class="font-medium">{{ post.time }}</div>
                <div class="text-gray-600">{{ post.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Time Picker Modal -->
    <div v-if="showTimePicker" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-80">
        <h3 class="text-lg font-semibold mb-4">Select Time</h3>
        
        <div class="flex space-x-4 mb-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-2">Hour</label>
            <select v-model="selectedHour" class="w-full border border-gray-300 rounded px-3 py-2">
              <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
            </select>
          </div>
          
          <div class="flex-1">
            <label class="block text-sm font-medium mb-2">Minute</label>
            <select v-model="selectedMinute" class="w-full border border-gray-300 rounded px-3 py-2">
              <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}</option>
            </select>
          </div>
          
          <div class="flex-1">
            <label class="block text-sm font-medium mb-2">AM/PM</label>
            <select v-model="selectedPeriod" class="w-full border border-gray-300 rounded px-3 py-2">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button @click="confirmTime" class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Confirm
          </button>
          <button @click="showTimePicker = false" class="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft, ChevronRight, ChevronDown, Calendar } from 'lucide-vue-next'

// Reactive state
const currentDate = ref(new Date())
const viewMode = ref('month')
const showDatePicker = ref(false)
const showViewDropdown = ref(false)
const showTimePicker = ref(false)
const pickerDate = ref(new Date())
const draggedPost = ref(null)

// Time picker state
const selectedHour = ref('12')
const selectedMinute = ref('00')
const selectedPeriod = ref('PM')

// Sample posts data
const posts = ref([
  {
    id: 1,
    content: 'Sample Twitter post content',
    time: '2:05 PM',
    date: '2025-06-17',
    channel: 'twitter'
  },
  {
    id: 2,
    content: 'Instagram post with image',
    time: '10:40 AM',
    date: '2025-06-28',
    channel: 'instagram'
  },
  {
    id: 3,
    content: 'Another Instagram post',
    time: '11:06 AM',
    date: '2025-06-28',
    channel: 'instagram'
  },
  {
    id: 4,
    content: 'Sample content for Monday',
    time: '3:00 PM',
    date: '2025-06-30',
    channel: 'instagram'
  },
  {
    id: 5,
    content: 'Thursday post content',
    time: '1:00 PM',
    date: '2025-07-03',
    channel: 'twitter'
  }
])

// Computed properties
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const pickerMonthYear = computed(() => {
  return pickerDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const timeSlots = [
  '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
]

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const minutes = ['00', '15', '30', '45']

const monthDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    dates.push({
      date: new Date(date),
      day: date.getDate(),
      isOtherMonth: date.getMonth() !== month,
      isToday: date.toDateString() === today.toDateString(),
      key: date.toISOString().split('T')[0]
    })
  }
  
  return dates
})

const weekDates = computed(() => {
  const startOfWeek = new Date(currentDate.value)
  const day = startOfWeek.getDay()
  startOfWeek.setDate(startOfWeek.getDate() - day)
  
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    
    dates.push({
      date: new Date(date),
      day: date.getDate(),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: date.toDateString() === today.toDateString(),
      key: date.toISOString().split('T')[0]
    })
  }
  
  return dates
})

const pickerDates = computed(() => {
  const year = pickerDate.value.getFullYear()
  const month = pickerDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const dates = []
  const today = new Date()
  const selected = currentDate.value
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    dates.push({
      date: new Date(date),
      day: date.getDate(),
      isOtherMonth: date.getMonth() !== month,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: date.toDateString() === selected.toDateString(),
      key: date.toISOString().split('T')[0]
    })
  }
  
  return dates
})

const groupedPosts = computed(() => {
  const groups = {}
  const today = new Date()
  
  posts.value.forEach(post => {
    const postDate = new Date(post.date)
    const dateKey = post.date
    
    if (!groups[dateKey]) {
      let dateLabel
      if (postDate.toDateString() === today.toDateString()) {
        dateLabel = 'Today'
      } else {
        dateLabel = postDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })
      }
      
      groups[dateKey] = {
        date: dateKey,
        dateLabel,
        posts: []
      }
    }
    
    groups[dateKey].posts.push(post)
  })
  
  return Object.values(groups).sort((a, b) => new Date(a.date) - new Date(b.date))
})

// Methods
const goPrev = () => {
  const newDate = new Date(currentDate.value)
  if (viewMode.value === 'week') {
    newDate.setDate(newDate.getDate() - 7)
  } else if (viewMode.value === 'month') {
    newDate.setMonth(newDate.getMonth() - 1)
  }
  currentDate.value = newDate
}

const goNext = () => {
  const newDate = new Date(currentDate.value)
  if (viewMode.value === 'week') {
    newDate.setDate(newDate.getDate() + 7)
  } else if (viewMode.value === 'month') {
    newDate.setMonth(newDate.getMonth() + 1)
  }
  currentDate.value = newDate
}

const resetToToday = () => {
  currentDate.value = new Date()
}

const changeView = (view) => {
  viewMode.value = view
  showViewDropdown.value = false
}

const prevMonth = () => {
  const newDate = new Date(pickerDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  pickerDate.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(pickerDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  pickerDate.value = newDate
}

const selectDate = (date) => {
  if (!date.isOtherMonth) {
    currentDate.value = new Date(date.date)
    showDatePicker.value = false
  }
}

const getPostsForDate = (date) => {
  const dateStr = date.toISOString().split('T')[0]
  return posts.value.filter(post => post.date === dateStr)
}

const getPostsForDateTime = (date, hour) => {
  const dateStr = date.toISOString().split('T')[0]
  return posts.value.filter(post => {
    if (post.date !== dateStr) return false
    const postHour = convertTo24Hour(post.time)
    const slotHour = timeSlots.indexOf(hour)
    return Math.floor(postHour) === slotHour
  })
}

const convertTo24Hour = (time12h) => {
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')
  if (hours === '12') {
    hours = '00'
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12
  }
  return parseInt(hours, 10) + parseInt(minutes, 10) / 60
}

const getPostPosition = (time) => {
  const hour24 = convertTo24Hour(time)
  const minutes = (hour24 % 1) * 60
  return (minutes / 60) * 64 // 64px is the height of each hour slot
}

const dragStart = (post) => {
  draggedPost.value = post
}

const dropPost = (event, date, hour = null) => {
  event.preventDefault()
  if (!draggedPost.value) return
  
  const dateStr = date.toISOString().split('T')[0]
  const postIndex = posts.value.findIndex(p => p.id === draggedPost.value.id)
  
  if (postIndex !== -1) {
    posts.value[postIndex].date = dateStr
    if (hour && viewMode.value === 'week') {
      // For week view, you might want to update the time based on the hour
      // This is a simplified version - you could open the time picker here
      showTimePicker.value = true
    }
  }
  
  draggedPost.value = null
}

const confirmTime = () => {
  if (draggedPost.value) {
    const postIndex = posts.value.findIndex(p => p.id === draggedPost.value.id)
    if (postIndex !== -1) {
      posts.value[postIndex].time = `${selectedHour.value}:${selectedMinute.value} ${selectedPeriod.value}`
    }
  }
  showTimePicker.value = false
  draggedPost.value = null
}

// Initialize picker date
onMounted(() => {
  pickerDate.value = new Date(currentDate.value)
})
</script>

<style scoped>
.calendar-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.auto-rows-fr {
  grid-auto-rows: 1fr;
}

/* Drag and drop visual feedback */
.cursor-move:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}
</style>