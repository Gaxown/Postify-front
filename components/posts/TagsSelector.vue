<template>
  <div class="relative">
    <button @click="showTagsDropdown = !showTagsDropdown" class="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
      <span>Add Tags</span>
      <span v-if="selectedTags.length > 0" class="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
        {{ selectedTags.length }}
      </span>
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <!-- Tags Dropdown -->
    <div v-if="showTagsDropdown" class="absolute top-full mt-1 right-0 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
      <div class="p-3">
        <!-- Search Input -->
        <div class="mb-3">
          <input
            v-model="tagSearch"
            type="text"
            placeholder="Search or create tag"
            class="w-full px-3 py-2 border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <!-- Selected Tags Display -->
        <div v-if="selectedTags.length > 0" class="mb-3 pb-3 border-b border-gray-200">
          <p class="text-xs font-medium text-gray-700 mb-2">Selected Tags:</p>
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="tagId in selectedTags" 
              :key="tagId"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
              :style="{ backgroundColor: getTagById(tagId)?.color }"
            >
              {{ getTagById(tagId)?.name }}
              <button @click="removeTag(tagId)" class="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </span>
          </div>
        </div>

        <!-- Tags List -->
        <div class="space-y-2 max-h-40 overflow-y-auto">
          <div v-for="tag in filteredTags" :key="tag.id" class="flex items-center space-x-3">
            <input
              :id="`tag-${tag.id}`"
              v-model="selectedTags"
              :value="tag.id"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: tag.color }"></div>
            <label :for="`tag-${tag.id}`" class="text-sm text-gray-700 cursor-pointer">{{ tag.name }}</label>
          </div>
        </div>

        <!-- Create New Tag Button -->
        <div v-if="tagSearch && !availableTags.some(t => t.name.toLowerCase() === tagSearch.toLowerCase())" class="mt-3 pt-3 border-t border-gray-200">
          <button @click="createNewTag" class="w-full text-left px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
            Create "{{ tagSearch }}"
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Tag {
  id: number
  name: string
  color: string
}

// Props
const props = defineProps<{
  modelValue?: number[]
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: number[]]
  'tags-changed': [tags: Tag[]]
}>()

// State
const showTagsDropdown = ref(false)
const tagSearch = ref('')
const selectedTags = ref<number[]>(props.modelValue || [])

// Sample tags data
const availableTags = ref<Tag[]>([
  { id: 1, name: 'bbb', color: '#8B5CF6' },  // purple
  { id: 2, name: 'tag', color: '#EC4899' },  // pink
  { id: 3, name: 'test', color: '#3B82F6' }, // blue
  { id: 4, name: 'marketing', color: '#10B981' }, // green
  { id: 5, name: 'social', color: '#F59E0B' }, // orange
])

// Computed
const filteredTags = computed(() => {
  if (!tagSearch.value) return availableTags.value
  return availableTags.value.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.value.toLowerCase())
  )
})

// Methods
const getTagById = (id: number): Tag | undefined => {
  return availableTags.value.find(tag => tag.id === id)
}

const removeTag = (tagId: number) => {
  selectedTags.value = selectedTags.value.filter(id => id !== tagId)
  updateParent()
}

const createNewTag = () => {
  const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  
  const newTag: Tag = {
    id: availableTags.value.length + 1,
    name: tagSearch.value,
    color: randomColor
  }
  
  availableTags.value.push(newTag)
  selectedTags.value.push(newTag.id)
  tagSearch.value = ''
  updateParent()
}

const updateParent = () => {
  emit('update:modelValue', selectedTags.value)
  const selectedTagObjects = selectedTags.value.map(id => getTagById(id)!).filter(Boolean)
  emit('tags-changed', selectedTagObjects)
}

// Close dropdown when clicking outside
const closeDropdown = (event: Event) => {
  const target = event.target as Element
  if (!target?.closest('.relative')) {
    showTagsDropdown.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    selectedTags.value = newValue
  }
})

watch(() => selectedTags.value, () => {
  updateParent()
}, { deep: true })

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script> 